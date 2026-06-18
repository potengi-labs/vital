/* ==========================================================
   POTENGI LABS COMPONENT LOADER
   v2.0
========================================================== */

class ComponentLoader {

    constructor() {

        this.cache = new Map();

    }

    async load(id, url, options = {}) {

        const {
            forceReload = false,
            onLoaded = null
        } = options;

        const container =
            document.getElementById(id);

        if (!container) {

            console.warn(
                `[Loader] Container não encontrado: ${id}`
            );

            return false;
        }

        try {

            let html;

            if (
                !forceReload &&
                this.cache.has(url)
            ) {

                html = this.cache.get(url);

            } else {

                const response =
                    await fetch(url);

                if (!response.ok) {

                    throw new Error(
                        `HTTP ${response.status}`
                    );

                }

                html =
                    await response.text();

                this.cache.set(url, html);

            }

            container.innerHTML = html;

            if (typeof onLoaded === "function") {

                onLoaded(container);

            }

            return true;

        } catch (error) {

            console.error(
                `[Loader] Erro ao carregar ${url}`,
                error
            );

            container.innerHTML = `
                <div class="component-error">
                    <strong>Falha ao carregar componente</strong>
                    <small>${url}</small>
                </div>
            `;

            return false;
        }

    }

    async loadMany(components = []) {

        return Promise.all(

            components.map(component =>

                this.load(
                    component.id,
                    component.url,
                    component.options || {}
                )

            )

        );

    }

}

/* ==========================================================
   INSTÂNCIA GLOBAL
========================================================== */

const componentLoader =
    new ComponentLoader();

/* ==========================================================
   MENU MOBILE
========================================================== */

function initMenuToggle() {

    const menuToggle =
        document.getElementById("menuToggle");

    const sidebar =
        document.querySelector(".sidebar");

    if (!menuToggle || !sidebar) return;

    menuToggle.addEventListener(
        "click",
        (e) => {

            e.stopPropagation();

            sidebar.classList.toggle("show");

        }
    );

    document.addEventListener(
        "click",
        (e) => {

            if (
                !sidebar.contains(e.target) &&
                !menuToggle.contains(e.target)
            ) {

                sidebar.classList.remove("show");

            }

        }
    );

}

/* ==========================================================
   TAB LOADER (NOVO)
========================================================== */

async function loadTab(tabName) {

    const tabContainer =
        document.getElementById("tab-container");

    if (!tabContainer) return;

    try {

        const response =
            await fetch(
                `assets/tabs/${tabName}.html`
            );

        if (!response.ok) {

            throw new Error(
                `Tab não encontrada`
            );

        }

        tabContainer.innerHTML =
            await response.text();

    } catch (error) {

        console.error(error);

        tabContainer.innerHTML = `
            <div class="component-error">
                Não foi possível carregar a aba.
            </div>
        `;

    }

}

/* ==========================================================
   INICIALIZAÇÃO
========================================================== */

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        await componentLoader.loadMany([

            {
                id: "header-container",
                url:
                "assets/components/vital-header.html"
            },

            {
                id: "sidebar-container",
                url:
                "assets/components/vital-sidebar.html"
            },

            {
                id: "footer-container",
                url:
                "assets/components/vital-footer.html"
            },

            {
                id: "painel-container",
                url:
                "assets/tabs/painel.html"
            }

        ]);

        initMenuToggle();

        /* TAB INICIAL */

        if (
            document.getElementById(
                "tab-container"
            )
        ) {

            loadTab("agenda");

        },
       {

            loadTab("documentos");

        },
       {

            loadTab("financeiro");

        },
       {

            loadTab("manutencao");

        },
       {

            loadTab("obras");

        },
       {

            loadTab("painel");

        },
       {

            loadTab("projetos");

        }

    }
);
