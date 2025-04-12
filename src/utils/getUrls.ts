export function getWhatsAppUrl(message: string): string {
  // Company WhatsApp number - centralized here for easy updates
  const whatsappNumber = '+14374638189';
  
  // Encode the message for URL use
  const encodedMessage = encodeURIComponent(message);
  
  // Return the formatted WhatsApp URL
  return `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
}

