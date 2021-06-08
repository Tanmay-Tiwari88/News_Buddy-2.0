import nltk
import sys
from newspaper import Article

Resultarticle= dict()

def getArticle( url ):
    article=Article(url)
    article.download()
    article.parse()
    article.nlp()
    #nltk.download('punkt')
    Resultarticle["title"] = article.title
    Resultarticle["authors"] = article.authors
    Resultarticle["topImage"] = article.top_image
    #Resultarticle["text"] = article.text
    Resultarticle["description"] = article.summary

getArticle(str(sys.argv[1]))
print(str(Resultarticle))

    