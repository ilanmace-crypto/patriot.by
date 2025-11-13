function showParticipationOptions() {
    const options = [
        "📚 Стать волонтёром в музее",
        "🌳 Участвовать в благоустройстве памятников", 
        "🎓 Организовать тематическое мероприятие в учебном заведении",
        "📱 Создать цифровой контент о истории войны",
        "🤝 Помочь ветеранам и их семьям",
        "🎨 Участвовать в патриотических творческих конкурсах"
    ];
    let message = "Способы участия в сохранении исторической памяти:\n\n";
    options.forEach((option, index) => {
        message += `${index + 1}. ${option}\n`;
    });
    message += "\nСвяжитесь с нами для получения дополнительной информации!";
    alert(message);
}
document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.lesson-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        setTimeout(() => {
            card.style.transition = 'all 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 200);
    });
});