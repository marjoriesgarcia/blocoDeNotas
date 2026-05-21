(function () {
    const STORAGE_KEY = 'blocoDeNotas-conteudo';
    const textarea = document.getElementById('blocoDeNotas');
    const salvarBtn = document.getElementById('salvarNotas');
    const limparBtn = document.getElementById('limparNotas');
    const exportBtn = document.getElementById('exportarNotas');
    const statusSalvar = document.getElementById('statusSalvar');

    if (!textarea) return;

    let localStorageDisponivel = false;
    let unsaved = false;

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

    const updateStatus = (state, text) => {
        const dot = statusSalvar.querySelector('.dot');
        const txt = statusSalvar.querySelector('.status-text');
        if (dot) {
            dot.classList.toggle('saving', state === 'saving');
            dot.classList.toggle('saved', state === 'saved');
        }
        if (txt && text) txt.textContent = text;
    };

    const loadNotes = () => {
        if (!localStorageDisponivel) return '';
        return localStorage.getItem(STORAGE_KEY) ?? '';
    };

    const saveNotes = (value, message = 'Salvo automaticamente') => {
        if (!localStorageDisponivel) {
            updateStatus('saved', 'Armazenamento indisponível');
            return;
        }
        try {
            updateStatus('saving', 'Salvando...');
            localStorage.setItem(STORAGE_KEY, value);
            unsaved = false;
            const now = new Date();
            updateStatus('saved', `${message} • ${now.toLocaleTimeString()}`);
        } catch (error) {
            console.warn('Não foi possível salvar as anotações.', error);
            updateStatus('saved', 'Erro ao salvar');
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

    const salvarDebounced = debounce((value) => saveNotes(value), 350);

    textarea.addEventListener('input', (event) => {
        unsaved = true;
        updateStatus('saving', 'Mudança não salva');
        salvarDebounced(event.target.value);
    });

    salvarBtn?.addEventListener('click', () => {
        saveNotes(textarea.value, 'Salvo manualmente');
    });

    limparBtn?.addEventListener('click', () => {
        if (!confirm('Deseja realmente limpar todas as notas?')) return;
        textarea.value = '';
        saveNotes('', 'Notas limpas');
    });

    exportBtn?.addEventListener('click', () => {
        const content = textarea.value || '';
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `minhas-anotacoes-${new Date().toISOString().slice(0,10)}.txt`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
        updateStatus('saved', 'Arquivo exportado');
    });

    // atalhos: Ctrl/Cmd+S para salvar
    window.addEventListener('keydown', (e) => {
        const isSave = (e.key === 's' || e.key === 'S') && (e.ctrlKey || e.metaKey);
        if (isSave) {
            e.preventDefault();
            saveNotes(textarea.value, 'Salvo com atalho');
        }
    });

    // antes de fechar, tenta salvar se houver mudanças
    window.addEventListener('beforeunload', (e) => {
        if (unsaved && localStorageDisponivel) {
            saveNotes(textarea.value);
            // browser shows generic message; modern browsers ignore custom string
            e.preventDefault();
            e.returnValue = '';
        }
    });

    // inicializa status visual
    updateStatus('saved', localStorageDisponivel ? 'Salvo automaticamente' : 'Armazenamento indisponível');
})();