// utils/dateUtils.js
const formatDate = (dateValue) => {
    if (!dateValue) return '';

    const currentYear = new Date().getFullYear();

    const monthNames = [
        'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
        'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
    ];

    const date = dateValue.toDate ? dateValue.toDate() : new Date(dateValue);
    const day = String(date.getDate()).padStart(2, '0');
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();

    if (currentYear === year)
        return `${day} ${month}`;
    return `${day} ${month} ${year}`;
};

const formatTimestamp = (timestamp: number | null) => {
    if (!timestamp) return 'Bilinmeyen Zaman';

    const now = new Date();
    const messageDate = new Date(timestamp);

    const diffMs = now.getTime() - messageDate.getTime(); // Zaman farkı (milisaniye)
    const diffMinutes = Math.floor(diffMs / 1000 / 60);   // Zaman farkı (dakika)
    const diffHours = Math.floor(diffMinutes / 60);       // Zaman farkı (saat)
    const diffDays = Math.floor(diffHours / 24);          // Zaman farkı (gün)

    if (diffMinutes < 1) {
        return `şimdi`;
    } else if (diffMinutes < 60) {
        return `${diffMinutes} dakika önce`;
    } else if (diffHours < 24) {
        return `${diffHours} saat önce`;
    } else if (diffHours > 24 && diffDays < 4) {
        return `${diffDays} gün önce`;
    } else {
        return formatDate(timestamp);
    }
};

export {formatDate, formatTimestamp};
