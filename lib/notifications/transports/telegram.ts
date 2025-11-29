const API_BASE = "https://api.telegram.org";

type ParseMode = "MarkdownV2" | "Markdown" | "HTML";

type SendMessageOptions = {
  chatId: string | number;
  text: string;
  parseMode?: ParseMode;
  disableWebPagePreview?: boolean;
  replyToMessageId?: number;
  inlineKeyboard?: Array<
    Array<{ text: string; url?: string; callback_data?: string }>
  >;
};

function assertEnv(name: string) {
  const v = process.env[name];
  if (!v) {
    throw new Error(`Missing env: ${name}`);
  }
  return v;
}

const BOT_TOKEN = assertEnv("TELEGRAM_BOT_TOKEN");

async function request<T>(method: string, body: any): Promise<T> {
  const res = await fetch(`${API_BASE}/bot${BOT_TOKEN}/${method}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  const json = await res.json();
  if (!json.ok) {
    const err = `Telegram API error on ${method}: ${JSON.stringify(json)}`;
    console.log(err);
    throw new Error(err);
  }
  return json.result as T;
}

function escapeText(text: string, parseMode: ParseMode) {
  if (parseMode === "MarkdownV2" || parseMode === "Markdown") {
    return text.replace(/([_*[\]()~`>#+\-=|{}.!])/g, "\\$1");
  }
  return text;
}

export async function sendTelegramMessage(opts: SendMessageOptions) {
  const {
    chatId,
    text: inputText,
    parseMode = "MarkdownV2",
    disableWebPagePreview,
    replyToMessageId,
    inlineKeyboard,
  } = opts;

  if (!chatId) {
    throw new Error(
      "No chatId provided and TELEGRAM_DEFAULT_CHAT_ID is not set. Either pass opts.chatId or capture/store a chat id.",
    );
  }

  const text = escapeText(inputText, parseMode);

  return request("sendMessage", {
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
  return request("sendPhoto", { chat_id: chatId, photo: photoUrl, caption });
}

export async function answerCallbackQuery(
  callbackQueryId: string,
  text?: string,
) {
  return request("answerCallbackQuery", {
    callback_query_id: callbackQueryId,
    text,
  });
}
