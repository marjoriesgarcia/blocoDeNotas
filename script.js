(function () {
    const STORAGE_KEY = 'blocoDeNotas-conteudo';
    const textarea = document.getElementById('blocoDeNotas');
    const salvarBtn = document.getElementById('salvarNotas');
    const limparBtn = document.getElementById('limparNotas');
    const statusSalvar = document.getElementById('statusSalvar');

    if (!textarea) return;

    let localStorageDisponivel = false;

    const supportsLocalStorage = () => {
        try {
            const testKey = '__teste_storage__';
            window.localStorage.setItem(testKey, testKey);
            window.localStorage.removeItem(testKey);
            return true;
        } catch {
            return false;
        }
    };

    const updateStatus = (message) => {
        statusSalvar.textContent = message;
    };

    const loadNotes = () => {
        if (!localStorageDisponivel) return '';
        return localStorage.getItem(STORAGE_KEY) ?? '';
    };

    const saveNotes = (value, message = 'Salvo automaticamente') => {
        if (!localStorageDisponivel) return;
        try {
            localStorage.setItem(STORAGE_KEY, value);
            updateStatus(message);
        } catch (error) {
            console.warn('Não foi possível salvar as anotações.', error);
            updateStatus('Erro ao salvar');
        }
    };

    const debounce = (fn, delay) => {
        let timeoutId;
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = window.setTimeout(() => fn(...args), delay);
        };
    };

    localStorageDisponivel = supportsLocalStorage();
    textarea.value = loadNotes();

    const salvarDebounced = debounce((value) => saveNotes(value), 250);
    textarea.addEventListener('input', (event) => {
        salvarDebounced(event.target.value);
    });

    salvarBtn?.addEventListener('click', () => {
        saveNotes(textarea.value, 'Salvo com sucesso');
    });

    limparBtn?.addEventListener('click', () => {
        textarea.value = '';
        saveNotes('', 'Notas limpas');
    });
})();