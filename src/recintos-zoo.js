const animais = {
    "LEAO": {tamanho: 3, bioma: ["savana"]},
    "LEOPARDO": {tamanho: 2, bioma: ["savana"]},
    "CROCODILO": {tamanho: 3, bioma: ["rio"]},
    "MACACO": {tamanho: 1, bioma: ["savana", "floresta"]},
    "GAZELA": {tamanho: 2, bioma: ["savana"]},
    "HIPOPOTAMO": {tamanho: 4, bioma: ["savana", "rio"]},
};

const recintos = [
    { numero : 1, bioma : "savana", tamanho : 10, animais : [{ especie : "MACACO", qutd: 3}] },
    { numero : 2, bioma : "floresta", tamanho : 5, animais : [] },
    { numero : 3, bioma : "savana e rio", tamanho : 7, animais : [{ especie : "GAZELA", qutd: 1}] },
    { numero : 4, bioma : "rio", tamanho : 8, animais : [] },
    { numero : 5, bioma : "savana", tamanho : 9, animais : [{ especie : "LEAO", qutd: 1}] },
];

class RecintosZoo {
    checarSavanaRio(animal,recinto){
        if (recinto.bioma === "savana e rio" 
            && (animal.bioma.includes("savana") || animal.bioma.includes("rio"))) {
                return true;
            }
        return false;
    }

    pegarEspacoOcupado(recintoEspecies, animais){
        let espacoOcupado = 0
        for (let i = 0; i < recintoEspecies.length; i++){
            espacoOcupado += (animais[recintoEspecies[i].especie].tamanho * recintoEspecies[i].qutd);
        } 
        return espacoOcupado
    }

    checarEspacoExtra(numEspecies, animais, animal){
        if (numEspecies > 0){
            for(let i = 0; i< animais.length; i++){
                if(animais[i].especie !== animal){
                    return 1;
                }
            }
        } 
        return 0;
    }

    checarCarnivoro(animais,animal){
        const animaisCarnivoros = ["LEAO", "LEOPARDO", "CROCODILO"];
        const carnivoroNoRecinto = animais.some(e => animaisCarnivoros.includes(e.especie));
        const novoCarnivoro = animaisCarnivoros.includes(animal)
        if (carnivoroNoRecinto || novoCarnivoro) {
            for(let i = 0; i< animais.length;i++){
                if (animais[i].especie !== animal) {
                    return false;
                }
            }            
        }
        return true;

    }

    analisaRecintos(animal, quantidade) {
        if (!(animal.toUpperCase() in animais)) {
            return { erro : "Animal inválido" }
        }
        if (quantidade <= 0) {
            return { erro : "Quantidade inválida" }
        }

        const a = animais[animal]
        const espaco = quantidade * a.tamanho
        

        const recintosViaveis = recintos.filter((recinto) => {
            const biomasCompativeis =  a.bioma.includes(recinto.bioma) || this.checarSavanaRio(a,recinto);
            if (!biomasCompativeis){
                return false;
            }

            let espacoOcupado = this.pegarEspacoOcupado(recinto.animais, animais);
            
            const numEspecies = recinto.animais.length;

            let espacoExtra = this.checarEspacoExtra(numEspecies, recinto.animais, animal)
            
            let espacoLivre = recinto.tamanho - espacoOcupado - espacoExtra;
            
            if (espacoLivre < espaco) {
                return false
            }   

            const validarCarnivoro = this.checarCarnivoro(recinto.animais, animal);

            if(!validarCarnivoro){
                return false;
            }

            if (animal === "MACACO" && numEspecies === 0 && quantidade === 1) {
                return false;
            }

            if (animal === "HIPOPOTAMO" && numEspecies > 0 && recinto.bioma !== "savana e rio") {
                return false;
            }
            
            return true;

        }).map(recinto => {
            const numEspecies = recinto.animais.length;
            const espacoExtra = this.checarEspacoExtra(numEspecies, recinto.animais, animal);
            const ocupado = this.pegarEspacoOcupado(recinto.animais, animais)
            const espacoLivre = recinto.tamanho - ocupado - espaco - espacoExtra;
            return `Recinto ${recinto.numero} (espaço livre: ${espacoLivre} total: ${recinto.tamanho})`;
        });
    
        if (recintosViaveis.length === 0) {
            return { erro: "Não há recinto viável" };
        }
    
        return { recintosViaveis : recintosViaveis };
        
    }

}

export { RecintosZoo as RecintosZoo };
