#curl -X POST "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/setWebhook" \
#  -H 'content-type: application/json' \
#  -d "{\"url\":\"$APP_BASE_URL/api/webhook/telegram?secret=$TELEGRAM_WEBHOOK_SECRET\"}"

curl "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/getWebhookInfo"
