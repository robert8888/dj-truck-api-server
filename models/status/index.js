module.exports.Status = class {
    constructor(success, msg, {details, data} = {}){
        this.success = success;
        this.error = !(success);
        this.message = msg;
        this.errorDatails = details;
        this.data = data;
    }

    toString(){
        return this.message;
    }
}