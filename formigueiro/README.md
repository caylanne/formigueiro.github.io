# Formigueiro (back-end Django + front-end 1.2)

Doações locais em Patos-PB. O Django serve as telas do front-end como templates
e os arquivos em `core/static/assets/`.

## Como rodar

```bash
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements.txt
python manage.py runserver
```

Abra http://127.0.0.1:8000/ (redireciona para o cadastro da ONG).

## Telas e rotas

| Rota                   | Nome (`[Ir para o cadastro](cadastro.html)`) | Tela                                   |
|------------------------|--------------------|----------------------------------------|
| `/cadastro/ong/`       | `cadastro_ong`     | Cadastro da ONG                        |
| `/cadastro/doador/`    | `cadastro_doador`  | Cadastro do doador                     |
| `/login/ong/`          | `login_ong`        | Login da ONG                           |
| `/login/doador/`       | `login_doador`     | Login do doador                        |
| `/ong/campanhas/`      | `home_ong`         | Home da ONG (lista de campanhas)       |
| `/ong/campanhas/nova/` | `criar_campanha`   | Criar campanha                         |
| `/ong/painel/`         | `painel_ong`       | Painel da ONG (novo no front 1.2)      |
| `/campanhas/`          | `home_doador`      | Home do doador (novo no front 1.2)     |
| `/campanha/?id=N`      | `campanha`         | Detalhe da campanha (novo no 1.2)      |
| `/doar/?id=N`          | `doar`             | Registrar doação (novo no front 1.2)   |
| `/ong/perfil/`, `/perfil/` | `perfil_ong`, `perfil_doador` | Ainda "em construção"   |

A ONG chega ao detalhe da campanha com `?de=ong` (ex.: `/campanha/?id=2&de=ong`).

## Como o Django conversa com o JS

Os JS não têm URLs fixas: o template injeta as rotas por `data-attributes`
(`data-destino`, `data-img-base`, `data-campanha-url`, `data-url-...`).
Ao criar uma tela nova, use `<a href="{% url 'cadastro' %}">Criar conta</a>` / `{% static %}` no template e leia o
valor no JS, em vez de escrever `algo.html` no código.

## O que ainda é protótipo

Os dados das campanhas estão em arrays dentro dos JS (`home.js`, `campanha.js`,
`doar.js`, `painel.js`) e cadastro/login usam `localStorage`. Não há models,
views nem API: os pontos marcados com `TODO` nos JS são onde entrará o `fetch`.
