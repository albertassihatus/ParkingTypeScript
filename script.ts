interface Veiculo {
    nome: string;
    placa: string;
    entrada: Date | string;
}


(function () {
    const $ = (query: string): HTMLInputElement | null => document.querySelector(query);

    function calcTempo(mil:number) {
        const min = Math.floor(mil / 60000);
        const sec = Math.floor((mil % 60000) / 1000);

        return `${min}m e ${sec}s`
    }

    function patio(){
        function ler():Veiculo[] { 
            return localStorage.patio ? JSON.parse(localStorage.patio) : [];
        }

        function save(veiculos: Veiculo[]) {
            localStorage.setItem("patio",JSON.stringify(veiculos));
        }

        function add(veiculo: Veiculo, salvar?: boolean){
            const row = document.createElement("tr");

            row.innerHTML = `
            <td>${veiculo.nome}</td>
            <td>${veiculo.entrada}</td>
            <td>${veiculo.placa}</td>
            <td>
                <button class="delete" data-placa="${veiculo.placa}">X</button>
            </td>
            `;

            row.querySelector(".delete")?.addEventListener("click", function () {
                remove(this.dataset.placa);
            })
        
            $("#patio")?.appendChild(row);

            if (salvar) save([...ler(), veiculo]);
        }

        function remove(placa: string) {
            const { entrada, nome } = ler().find(
                (veiculo) => veiculo.placa === placa);

            const tempo = calcTempo(new Date().getTime() - new Date(entrada).getTime());
            
            if(!confirm(`O ${nome} permaneceu por ${tempo}. Deseja encerrar?`)) return;

            save(ler().filter(veiculo => veiculo.placa !==placa));
            render();
        }

        function render(){
            $("#patio")!.innerHTML = "";
            const patio = ler();

            if(patio.length){
                patio.forEach(veiculo => add(veiculo));
            }
        }

        return { ler, add, remove, save, render };
    }

    patio().render();

    $("#cadastrar")?.addEventListener("click", () => {
        const nome = $("#nome")?.value;
        const placa = $("#placa")?.value;

        if (!nome || !placa) {
            alert("Campos invalidos");
            return;
        }

        patio().add({ nome, placa, entrada: new Date().toISOString() }, true);
    });
})();