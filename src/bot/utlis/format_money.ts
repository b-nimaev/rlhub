export default function formatMoney(amount: any) {
    return new Intl.NumberFormat('ru-RU').format(amount);
}