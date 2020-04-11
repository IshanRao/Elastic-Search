from flask import Flask,request
from flask_cors import CORS
from time import sleep
from elasticsearch import Elasticsearch
es = Elasticsearch(['http://localhost:9200'])

app = Flask(__name__)
CORS(app)


@app.route('/', methods=['GET'])
def health_check():
    return {
        "success": True,
        "response_code": "success",
        "message": "backend is live & running"
    }

@app.route('/vw-search', methods=['POST'])
def search_api():
    search_phrase = request.get_json().get('searchPhrase')
    if search_phrase:
        print(search_phrase)
        #do elastic search operations on search_phrase
        res = es.search(
            index="students-data-2", 
            body={
                "query": {
                    "bool": {
                        "should": [
                            {
                                "multi_match": {
                                    "query": search_phrase,
                                    "fields": [
                                        "name^2",
                                        "class"
                                    ]
                                } 
                            },
                            {
                                "nested": {
                                    "path": "skills",
                                    "query": {
                                        "multi_match": {
                                            "query": search_phrase,
                                            "fields": [
                                                "skills.name",
                                                "skills.description"
                                            ]
                                        }
                                    }
                                }
                            }
                        ]
                    }
                }
            }
        )

        sleep(2)
        return {
            "success": True,
            "response_code": "success",
            "data": res['hits']['hits']
        }
    else:
        return {
            "success": False,
            "response_code": "failure",
            "message": "search phrase missing"
        }

if __name__ == "__main__":
    app.run()