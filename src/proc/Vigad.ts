import RandExp from "randexp";

export class Vigad {
    public main() {
        let data:string = "Here we have some random text that was HP: 55 fetched from the image, including som data in between."

        this.match(data, /[0-100]/); // value regex
    }


    private match(data:string, regex:RegExp):void {
        let findAfter:RegExp = /HP:/;   // value regex can be found after this
        let findBefore:RegExp = /fetched/;  // value regex can be found before this
        let valuesubstr:string = data.substring(this.indexOfFirst(data, findAfter, true), this.indexOfFirst(data, findBefore)); // split string to substring containing value regex
        console.log("Substr: ");
        console.log(valuesubstr);
        let res = valuesubstr.match(regex); // find value matching the value regex
        console.log(res);
        console.log("---------------------------------------------");
        console.log(this.matchingToPercentage(data, regex));
    }

    private indexOfFirst(data:string, regex:RegExp, before:boolean = false):number {
        let match = data.match(regex);
        let index = match!.index;
        if (before) {
            index! += match![0].length;
        }
        return index!;
    }

    private matchingToPercentage(data:string, regex:RegExp) {
        const randexp = new RandExp(regex);
        console.log(randexp.gen());
    }

}