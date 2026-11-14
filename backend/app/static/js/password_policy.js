(function () {
  const rules = [
    { label: '6 to 128 characters', test: password => [...password].length >= 6 && [...password].length <= 128 },
    { label: 'An uppercase letter (A-Z)', test: password => /[A-Z]/.test(password) },
    { label: 'A lowercase letter (a-z)', test: password => /[a-z]/.test(password) },
    { label: 'A number (0-9)', test: password => /[0-9]/.test(password) },
    { label: 'A symbol (such as !, @, $, or /)', test: password => /[\p{P}\p{S}]/u.test(password) },
  ];

  function bind(inputId, listId) {
    const input = document.getElementById(inputId);
    const list = document.getElementById(listId);
    const items = rules.map(rule => {
      const item = document.createElement('li');
      item.textContent = rule.label;
      list.appendChild(item);
      return item;
    });
    function update() {
      rules.forEach((rule, index) => items[index].classList.toggle('met', rule.test(input.value)));
    }
    input.addEventListener('input', update);
    update();
  }

  window.PasswordPolicy = {
    bind,
    valid: password => rules.every(rule => rule.test(password)),
  };
})();
