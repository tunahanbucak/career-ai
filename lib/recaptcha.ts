export async function verifyRecaptcha(token: string): Promise<boolean> {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;

  if (!secretKey) {
    console.error("reCAPTCHA secret key bulunamadı!");
    return false;
  }

  try {
    const response = await fetch(
      "https://www.google.com/recaptcha/api/siteverify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `secret=${secretKey}&response=${token}`,
      }
    );

    const data = await response.json();

    // reCAPTCHA v3: score kontrolü (0.0 - 1.0 arası)
    // 0.5'ten yüksekse insan, düşükse bot olabilir
    if (data.success && data.score >= 0.5) {
      return true;
    }

    console.warn("reCAPTCHA başarısız:", data);
    return false;
  } catch (error) {
    console.error("reCAPTCHA doğrulama hatası:", error);
    return false;
  }
}
