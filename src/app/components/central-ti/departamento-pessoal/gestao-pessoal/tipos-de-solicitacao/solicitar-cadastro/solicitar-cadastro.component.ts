import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { DialogConfirmacaoCadastroComponent } from 'src/app/components/central-ti/modais/modais-dp/dialog/dialog-confirmacao-cadastro/dialog-confirmacao-cadastro.component';
import { MatDialog } from '@angular/material/dialog';
import { DadosColaboradores } from 'src/app/interface/dados-colaboradores';
import { Router } from '@angular/router';
import { CadastroColaboradorService } from 'src/app/services/departamento-pessoal/cadastro-colaborador/cadastro-colaborador.service';
import { ChatSolicitacoes } from 'src/app/interface/chatSolicitacoes';
import { ChatSolicitacoesService } from 'src/app/services/departamento-pessoal/chat-solicitacoes/chat-solicitacoes.service';
import { Validators } from '@angular/forms';
import { DepartamentoFiliaisService } from 'src/app/services/select-departamentos-filiais/departamento-filiais.service';
import { Filiais } from 'src/app/interface/filiais';
import { Departamentos } from 'src/app/interface/departamento';



@Component({
  selector: 'app-solicitar-cadastro',
  templateUrl: './solicitar-cadastro.component.html',
  styleUrls: ['./solicitar-cadastro.component.scss']
})
export class SolicitarCadastroComponent {

  cpfMask = [/\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/];

  telefoneMask = ['(', /[1-9]/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];

   departamento: Departamentos[] = [];
  
   filial: Filiais[] = [];


  inputItemFormControl = new FormControl();
  textareaItemFormControl = new FormControl();

  mensagem: string = '';
  comentarios: string[] = [];



  enviarMensagem() {
    // Adicionar o comentário à lista de comentários
    this.comentarios.push(this.mensagem);
    
    // Limpar o campo de entrada
    this.mensagem = '';
  }
  imagemSelecionadaTermo: File | null = null
  anexarTermo(event: any) {
    if (event.target.files && event.target.files[0]) {
      this.imagemSelecionadaTermo = event.target.files[0];
    }
  }

  imagemSelecionadaContrato: File | null = null
  anexarContrato(event: any) {
    if (event.target.files && event.target.files[0]) {
      this.imagemSelecionadaContrato = event.target.files[0];
    }
  }

  constructor(private dialog: MatDialog,
    private toastrService: NbToastrService,private router:Router,
    private cadastroColaboradorService: CadastroColaboradorService,
    private departamentoFiliaisService: DepartamentoFiliaisService,
    private chatSolicitacoesService: ChatSolicitacoesService
  ){
  
    }

  openConfirmar() {
    this.dialog.open(DialogConfirmacaoCadastroComponent);
  }

  getFormattedDateTime(): string {
    // Gerando uma data e hora aleatórias para teste
    const dataHora = new Date();
    return dataHora.toLocaleString();
  }

  dadosColaboradores: DadosColaboradores = {
    usuario_solicitante: "",
    nome: "",
    numero: "",
    cpf: "",
    filial: "",
    cargo: "",
    departamento: "",
    computador: null,
    atualizado_por: "",
    termo: false,
    regimeContratacao: "",
    status: true,
  }


    


  create(){
    
    this.cadastroColaboradorService.cadastrarColaborador(this.dadosColaboradores).subscribe(
      response => {
      this.toastrService.success("Colaborador cadastrado com sucesso!", "Sucesso");
      setTimeout(() => {
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigate(['/gestao-pessoal']); // Navega para a rota de cadastro de armazém
        });
        }, 1000); 
      },
      error => {
        if (error.status === 403) {
          setTimeout(() => {
            location.reload(); // Recarrega a página após1 segundos
          }, 2000);
        } else {
          if (error.error && error.error.message) {
            this.toastrService.warning(error.error.message, "Erro");
            this.toastrService.warning("Conferir CPF", "Erro");
          } else {
            this.toastrService.warning('Erro ao cadastrar colaborador!', "Erro");
          }
        }
      }
    )

  }

  isFormEmpty(): boolean {
    
    if(this.validarCPF(this.dadosColaboradores.cpf)){
      const inputs: (keyof DadosColaboradores)[] = ['nome', 'numero', 'cpf', 'filial', 'cargo', 'departamento', 'regimeContratacao'];
      return inputs.some(field => !this.dadosColaboradores[field]);
    }
    return true;
  }



  validarCPF(cpf: string) {
    cpf = cpf.replace(/[^\d]+/g, ''); // Remove caracteres não numéricos

    if (cpf.length !== 11 || cpf.match(/^(.)\1*$/)) {
        return false; // Verifica se o CPF tem 11 dígitos e não é uma sequência repetida
    }

    // Calcula o primeiro dígito verificador
    var sum = 0;
    for (var i = 0; i < 9; i++) {
        sum += parseInt(cpf.charAt(i)) * (10 - i);
    }
    var remainder = 11 - (sum % 11);
    var firstDigit = remainder === 10 || remainder === 11 ? 0 : remainder;

    // Verifica o primeiro dígito verificador
    if (parseInt(cpf.charAt(9)) !== firstDigit) {
        return false;
    }

    // Calcula o segundo dígito verificador
    sum = 0;
    for (var i = 0; i < 10; i++) {
        sum += parseInt(cpf.charAt(i)) * (11 - i);
    }
    remainder = 11 - (sum % 11);
    var secondDigit = remainder === 10 || remainder === 11 ? 0 : remainder;

    // Verifica o segundo dígito verificador
    if (parseInt(cpf.charAt(10)) !== secondDigit) {
        return false;
    }

    return true;
}

  getFiliais(): void {
    this.departamentoFiliaisService.getAllFiliais().subscribe(filiais => {
      this.filial = filiais;
      console.log(filiais);
    });
  }

  getDepartamentos(): void {
    this.departamentoFiliaisService.getAllDepartamentos().subscribe(departamentos => {
      this.departamento = departamentos;
      console.log(departamentos);
    });
  }

  ngOnInit() {
    this.getFiliais();
    this.getDepartamentos();
  }

}
