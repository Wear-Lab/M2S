from flask import Flask, jsonify, request
from lsmt_model import generate_word

app = Flask(__name__)

@app.route('/generate', methods=['POST'])
def generate():
    word = generate_word()
    response = {'word': word}
    return jsonify(response)

if __name__ == '__main__':
    app.run()
