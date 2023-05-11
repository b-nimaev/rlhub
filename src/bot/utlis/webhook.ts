import { bot } from "../..";


export default async function set_webhook() {
    if (process.env.MODE === 'production') {
        bot.telegram.setWebhook(
            `${process.env.WEBHOOK_URL}/bot${process.env.secret_path}`
        ).then(() => {
            console.log('webhook setted')
        });
    } else {
        await fetch('http://localhost:4040/api/tunnels')
            .then((res: { json: () => any; }) => res.json())
            .then((json: { tunnels: any[]; }) => json.tunnels.find(tunnel => tunnel.proto === 'https'))
            .then((secureTunnel: { public_url: any; }) => bot.telegram.setWebhook(`${secureTunnel.public_url}/bot`))
            .then(async (status: any) => {
                console.log(`webhook setted: ${status}`)
            })
    }
}