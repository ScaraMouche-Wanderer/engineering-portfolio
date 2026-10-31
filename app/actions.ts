"use server";

import { prisma } from "@/lib/db";
import { headers } from "next/headers";

export async function submitContactForm(formData: FormData) {
  const headerList = await headers();
  const ip = headerList.get("x-forwarded-for")?.split(',')[0] || "127.0.0.1";

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const message = formData.get("message") as string;
  const honeypot = formData.get("website") as string; // Hidden field

  // 1. Honeypot Validation
  if (honeypot) {
    await prisma.securityLog.create({
      data: { ip, event: "HONEYPOT_TRIGGERED", details: "Bot detected", severity: "high" }
    });
    return { success: true }; // Silent discard
  }

  if (!name || !email || !message) {
    return { success: false, error: "Missing fields" };
  }

  // 2. Length Validation
  if (name.length > 100 || email.length > 150 || message.length > 3000) {
    return { success: false, error: "Input exceeds maximum allowed length." };
  }

  // 3. Email Validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { success: false, error: "Invalid email address format" };
  }

  // 4. Rate Limiting (3 messages per 24h per IP/Email)
  const last24h = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const existingSubmissions = await prisma.contactMessage.count({
    where: {
      OR: [
        { email: email.trim().toLowerCase() },
        { name: { contains: `[IP:${ip}]` } } 
      ],
      createdAt: { gte: last24h }
    }
  });

  if (existingSubmissions >= 3) {
    await prisma.securityLog.create({
      data: { ip, event: "RATE_LIMIT_EXCEEDED", details: `Email: ${email}`, severity: "medium" }
    });
    return { success: false, error: "Transmission limit reached. Please try again tomorrow." };
  }

  // 5. Malicious Pattern Detection
  const maliciousPatterns = [
    /<script/i, /javascript:/i, /onerror=/i, /onclick=/i, /onload=/i,
    /SELECT.*FROM/i, /UNION.*SELECT/i, /INSERT.*INTO/i, /DELETE.*FROM/i, /DROP.*TABLE/i
  ];

  const isMalicious = maliciousPatterns.some(pattern => 
    pattern.test(name) || pattern.test(email) || pattern.test(message)
  );

  if (isMalicious) {
    await prisma.securityLog.create({
      data: { ip, event: "MALICIOUS_INPUT_BLOCKED", details: `Name: ${name}, Email: ${email}`, severity: "high" }
    });
    return { success: false, error: "Security violation detected. Attempt logged." };
  }

  // 6. Sanitization
  const cleanMessage = message.replace(/<[^>]*>?/gm, '').trim();
  const cleanName = name.replace(/<[^>]*>?/gm, '').trim();

  try {
    if (!prisma) throw new Error("Prisma client is not initialized");

    await prisma.contactMessage.create({
      data: {
        name: `${cleanName} [IP:${ip}]`,
        email: email.trim().toLowerCase(),
        message: cleanMessage,
      },
    });

    // Optional: Dispatch real-time alert to Webhook (Discord / Slack / Telegram / Zapier) if configured
    const webhookUrl = process.env.CONTACT_WEBHOOK_URL;
    if (webhookUrl) {
      try {
        await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content: `📬 **New Portfolio Contact Transmission**\n**From:** ${cleanName} (${email})\n**IP:** ${ip}\n**Message:**\n>>> ${cleanMessage}`,
          }),
        });
      } catch (webhookErr) {
        console.error("Webhook notification error:", webhookErr);
      }
    }

    return { success: true };
  } catch {
    return { success: false, error: "A transmission error occurred. Please try again later." };
  }
}
