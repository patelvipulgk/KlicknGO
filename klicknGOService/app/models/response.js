module.exports = Response;

function Response(code, status, data, message) {
    this.code = code;
    this.status = status,
    this.data = data;
    this.message = message;
}