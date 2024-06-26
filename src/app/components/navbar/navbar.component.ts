import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NbMenuItem, NbToastrService } from '@nebular/theme';
import { Usuario } from 'src/app/interface/usuario-interface';
import { AuthserviceService } from 'src/app/services/authservice.service';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  
  items: NbMenuItem[] = [

    {
      title: 'Página Inicial',
      icon: 'home-outline',
      link: '/home',
    },
    {
      title: 'Departamento Pessoal',
      icon: '',
      hidden: !this.authService.hasPermission(['ROLE_ADMIN','ROLE_DP']),
      children: [
        {title: 'Gestão Pessoal',icon: '',link: '/gestao-pessoal'},
        {title: 'Solicitaçoes Colaboradores',icon: '',link: '/solicitacao-colaboradores-dp',},
        {title: 'Colaboradores',icon: '',link: '/colaboradores-dp',},
      ]
    },

    {
      title: 'Departamento T.I',
      icon: '',
      hidden: !this.authService.hasPermission(['ROLE_ADMIN','ROLE_TI']),
      children: [
        {title: 'Solicitações Colaboradores',icon: '',link: '/solicitacoes-colaboradores-ti'},
        // {title: 'Chamados',icon: '',link: '/chamados-ti'},
        {title: 'Gestão Pessoal',icon: '',link: '/gestao-pessoal-ti'},
        {title: 'Colaboradores',icon: '',link: '/colaboradores-ti',},
        {title: 'Computadores',icon: '',link: '/computadores-ti',},
        {title: 'Gestão de Ativos',
        icon: '',
        children: [
          {title: 'Impressoras',icon: '',link: '/gestao-impressoras-ti'},
          {title: 'Computadores Desativados',icon: '',link: '/gestao-computador-ti'},
          {title: 'CPD',icon: '',link: '/gestao-cpd-ti'},
          {title: 'Monitores',icon: '',link: '/gestao-monitor-ti'},
          {title: 'Outros',icon: '',link: '/gestao-outros-ti'},
        ]
      },
      ]
    },
    
    // {
    //   title: 'Chamados',
    //   icon: '',
    //   children: [
    //     {title: 'Criar Chamado',icon: '',link: '/criar-chamados-geral'},
    //     {title: 'Visualizar Chamados',icon: '',link: '/visualizar-chamados-geral'},
    //   ]
    // },

    {
      title: 'Cadastrar Usuários',
      link:"/cadastrar-usuario",
      hidden: !this.authService.hasPermission(['ROLE_ADMIN','ROLE_TI']),
    },
  ];
  
  items2 = [

  ];

  ngOnInit() {
    this.loadUser();
  }

  constructor(
              private usuarioService: UsuarioService,
              private toastrService: NbToastrService,private router:Router,
              private authService:AuthserviceService
  
) {

  }

  usuario: Usuario = {
    name: '',
    login: '',
    password: '',
    role: '',
  }

  loadUser() {
    this.usuarioService.getUserByEmail().subscribe(
      (user: Usuario) => {
        this.usuario =  user; // Armazene os dados do Pessoa na variável local

      },
      (error) => {
        console.error('Erro ao carregar dados do Pessoa:', error);
      }
    );
  }

}