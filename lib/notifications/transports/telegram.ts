// lib/telegram.ts
const API_BASE = "https://api.telegram.org";

type SendMessageOptions = {
  chatId?: string | number; // overrides default chat
  text: string;
  parseMode?: "MarkdownV2" | "HTML";
  disableWebPagePreview?: boolean;
  replyToMessageId?: number;
  inlineKeyboard?: Array<
    Array<{ text: string; url?: string; callback_data?: string }>
  >;
};

function assertEnv(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env: ${name}`);
  return v;
}

const BOT_TOKEN = assertEnv("TELEGRAM_BOT_TOKEN");
const DEFAULT_CHAT_ID = process.env.TELEGRAM_DEFAULT_CHAT_ID;

async function tgFetch<T>(method: string, body: any): Promise<T> {
  const res = await fetch(`${API_BASE}/bot${BOT_TOKEN}/${method}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  const json = await res.json();
  if (!json.ok) {
    throw new Error(`Telegram API error on ${method}: ${JSON.stringify(json)}`);
  }
  return json.result as T;
}

export async function sendTelegramMessage(opts: SendMessageOptions) {
  const {
    chatId = DEFAULT_CHAT_ID,
    text,
    parseMode,
    disableWebPagePreview,
    replyToMessageId,
    inlineKeyboard,
  } = opts;

  if (!chatId) {
    throw new Error(
      "No chatId provided and TELEGRAM_DEFAULT_CHAT_ID is not set. Either pass opts.chatId or capture/store a chat id.",
    );
  }

  return tgFetch("sendMessage", {
    chat_id: chatId,
    text,
    parse_mode: parseMode,
    disable_web_page_preview: disableWebPagePreview,
    reply_to_message_id: replyToMessageId,
    reply_markup: inlineKeyboard
      ? { inline_keyboard: inlineKeyboard }
      : undefined,
  });
}

// Extras you might want later:
export async function sendPhoto(
  chatId: string | number,
  photoUrl: string,
  caption?: string,
) {
  return tgFetch("sendPhoto", { chat_id: chatId, photo: photoUrl, caption });
}

export async function answerCallbackQuery(
  callbackQueryId: string,
  text?: string,
) {
  return tgFetch("answerCallbackQuery", {
    callback_query_id: callbackQueryId,
    text,
  });
}
