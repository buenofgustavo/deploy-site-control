import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { Departamentos } from 'src/app/interface/departamento';
import { Filiais } from 'src/app/interface/filiais';
import { GestaoAtivos } from 'src/app/interface/gestaoAtivos';
import { GestaoAtivosService } from 'src/app/services/departamento-ti/gestao-ativos/gestao-ativos.service';
import { DepartamentoFiliaisService } from 'src/app/services/select-departamentos-filiais/departamento-filiais.service';


@Component({
  selector: 'app-modal-gestao-monitores',
  templateUrl: './modal-gestao-monitores.component.html',
  styleUrls: ['./modal-gestao-monitores.component.scss']
})
export class ModalGestaoMonitoresComponent {
  selectedItemCategoria = "Computador"
  selectedItemCategoria2 = "Ativo"
  selectedItemCategoria3 = "Matriz"

  constructor(private dialog: MatDialog,
    private toastrService: NbToastrService,private router:Router,
    private gestaoAtivosService: GestaoAtivosService,
    private departamentoFiliaisService: DepartamentoFiliaisService,

  ){
  
    }

  gestaoAtivos: GestaoAtivos = {
    nome: "",
    tipo: "Monitor",
    status: "",
    descricao: "",
    localizacao: "",
    atualizadoPor: "",
  }

  create(){
    console.log(this.gestaoAtivos)
    this.gestaoAtivosService.cadastrarAtivos(this.gestaoAtivos).subscribe(
      response => {
      this.toastrService.success("Ativo cadastrado com sucesso!", "Sucesso");
      setTimeout(() => {
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigate(['/gestao-monitor-ti']); // Navega para a rota de cadastro de armazém
        });
        }, 1000); 
      },
      error =>{
        if(error.error && error.error.message){
          this.toastrService.warning(error.error.message, "Erro");

        }
        else{
          this.toastrService.warning('Erro ao Cadastrar Ativo!', "Erro");
        }
      }
    )

  }

  
  filial: Filiais[] = [];

  getFiliais(): void {
    this.departamentoFiliaisService.getAllFiliais().subscribe(filiais => {
      this.filial = filiais;
      console.log(filiais);
    });
  }

  ngOnInit() {
    this.getFiliais();
  }

}