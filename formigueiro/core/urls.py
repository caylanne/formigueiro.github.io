from django.urls import path
from django.views.generic import TemplateView, RedirectView

def tela(nome, arquivo):
    return TemplateView.as_view(template_name=f'core/{arquivo}.html')

def provisoria(titulo):
    return TemplateView.as_view(template_name='core/em_construcao.html',
                                extra_context={'titulo': titulo})

urlpatterns = [
    path('', RedirectView.as_view(pattern_name='cadastro_ong'), name='home'),

    # cadastro e login
    path('cadastro/doador/', tela('cadastro_doador', 'cadastro-doador'), name='cadastro_doador'),
    path('cadastro/ong/',    tela('cadastro_ong',    'cadastro-ong'),    name='cadastro_ong'),
    path('login/doador/',    tela('login_doador',    'login-doador'),    name='login_doador'),
    path('login/ong/',       tela('login_ong',       'login-ong'),       name='login_ong'),

    # área da ONG
    path('ong/campanhas/',      tela('home_ong', 'home-ong'),              name='home_ong'),
    path('ong/campanhas/nova/', tela('criar_campanha', 'criar-campanha'),  name='criar_campanha'),
    path('ong/painel/',         tela('painel_ong', 'painel-ong'),          name='painel_ong'),

    # área do doador
    path('campanhas/',       tela('home_doador', 'home-doador'), name='home_doador'),
    path('doar/',            tela('doar', 'doar'),               name='doar'),

    # detalhe da campanha (doador e ONG; a ONG chega com ?de=ong)
    path('campanha/',        tela('campanha', 'campanha'),       name='campanha'),

    # ainda sem tela no protótipo (links existem nos HTMLs originais)
    path('ong/perfil/',      provisoria('Perfil da ONG'),     name='perfil_ong'),
    path('perfil/',          provisoria('Perfil do doador'),  name='perfil_doador'),
]
