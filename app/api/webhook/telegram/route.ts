import { sendTelegramMessage } from "@/lib/notifications/transports/telegram";
import { ForbiddenError, errorMiddleware } from "@/lib/error";

// Optional shared secret to secure the webhook URL
const SECRET = process.env.TELEGRAM_WEBHOOK_SECRET;

export const POST = errorMiddleware(
  async (req: Request, { params }: { params: Promise<{ secret: string }> }) => {
    const { secret } = await params;
    if (SECRET && secret !== SECRET) {
      throw new ForbiddenError(`Bad secret provided`);
    }

    const update = await req.json();

    if (update.message) {
      const chat = update.message.chat;
      const chatId = chat.id;
      const username = chat.username ?? chat.first_name ?? "there";

      // Store chatId in DB if you want to (e.g., linked to Place or user)
      // await prisma.place.update({ where: { id: "..." }, data: { telegramChatId: String(chatId) } });

      // Reply with the chatId
      await sendTelegramMessage({
        chatId,
        text: `👋 Hi ${username}!\n\nYour chat ID is:\n<code>${chatId}</code>\n\nCopy this ID and paste it into the Place settings in your dashboard.`,
        parseMode: "HTML",
      });
    }
  },
);
