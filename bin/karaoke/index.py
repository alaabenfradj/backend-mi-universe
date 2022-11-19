from bs4 import BeautifulSoup

import json
file_path = 'index.html'
file_content = open(file_path, encoding='utf-8').read()
html = BeautifulSoup(file_content, "html.parser")
items_div = html.find("div", {"id": "items"})
items_array = items_div.findAll(recursive=False)

data = []
for index, item in enumerate(items_array):
    try:
        a = item.find("a", {"id": "video-title"}, href=True)
        video_src = a['href']
        title = a['title'].replace(" (Karaoke Version)", "")
        singer = title.split("-")[0]
        song = title.split("-")[1].strip()
        img_src = item.find("img", {"id": "img"})['src']
        duration = item.find("span", {"id": "text"}).text.strip()

        element = dict(
            id = index,
            Singer=singer.lower(),
                       Song=song.lower(),
                       Duration=duration,
                       Image=img_src,
                       Video="https://www.youtube.com" + video_src)
        data.append(element)
    except Exception as exp:
        print(exp)


with open('data.json','w') as json_file :
    json.dump(data,json_file)
