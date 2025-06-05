<template>
  <div class="component-wrapper">
    <div class="flex flex-row flex-wrap min-h-screen bg-white">
      <div class="left">
        <div class="hello p-4">
          <h1 class="helloText " >Hej, Kasper!</h1>
          <div class="flex items-center space-x-">
            <span class="text-gray-400 text-sm ">@Standard Abonnement</span>
            <button class="p-0 ml-3 mb-5 bg-transparent border-none focus:outline-none" aria-label="Options">
              <svg width="30" height="5" viewBox="0 0 30 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                <ellipse cx="2.61341" cy="2.5" rx="2.61341" ry="2.5" fill="black"/>
                <ellipse cx="15.1578" cy="2.5" rx="2.61341" ry="2.5" fill="black"/>
                <ellipse cx="26.6569" cy="2.5" rx="2.61341" ry="2.5" fill="black"/>
              </svg>
            </button>
          </div>
        </div>

        <div class="dropdown mb-3 ml-4 md:ml-8">
          <p class="title">Titel: Hvad lever er fuld af</p>
          <svg class="selectIcon ml-auto mr-5" width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
            <rect  width="30" height="30" fill="url(#pattern0_1_283)"/>
            <defs>
            <pattern id="pattern0_1_283" patternContentUnits="objectBoundingBox" width="1" height="1">
            <use xlink:href="#image0_1_283" transform="scale(0.0111111)"/>
            </pattern>  
            <image id="image0_1_283" width="90" height="90" preserveAspectRatio="none" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAABaCAYAAAA4qEECAAAACXBIWXMAAAsTAAALEwEAmpwYAAABFklEQVR4nO3aQUoEMRBA0V6pN5+FON7FxVAncuHMHUoaXIiuuzpJvQdZh3xCSCDbBgAAAAAAAAAAAAAAR8rMp8y8ZuYj+3lk5tveoCL0+9mrHcC1InTHnfzXvSL0/d+0/XxVhN7PqO5eK0I/Z+Yt+7rtDQ4P/evm8ZH9RGa+lERuHDvKIzeMHadFbhQ7To/cIHYME3nh2DFc5AVjx7CRF4odw0deIHZME3ni2DFd5Aljx7SRJ4od00eeIHYsE3ng2LFc5AFjrxt5oNjrRx4gdp/IJ8buF/mE2H0jF8YWuSC2yAWxRS6ILXJBbJELYotcEFvkgtgiF8SO9o+Rgtgh8jG/WC+Z+fkzLmW/OgEAAAAAAADYpvANNxEvGQyHOyEAAAAASUVORK5CYII="/>
            </defs>
          </svg>

        </div>

        <div class="progress-container ml-4 md:ml-8 relative text-black rounded-full flex items-center justify-between px-4">
          <span class="waiting text-sm z-10">Næsten færdig...fortsæt med at skrive</span>
        </div>

        <div class="progress-bar ml-4 md:ml-8">
          <span class="percentage   absolute ml-auto mr-6 " style="top: -35px;font-family:  Spline Sans;">78%</span>
          <div class="progress-bar-percentage" :style="{ width: '78%' }">
            
        </div>
        </div>
       




        <div class="score-table ml-4 md:ml-6 mt-3">
          <table>
            <thead>
              <tr>
                <th>Område</th>
                <th>#1<br>31/1-25</th>
                <th>#2<br>12/3-25</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="category">Global Score 
                    <svg class="infoIcon"  viewBox="0 0 19 43"  xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                      <rect width="19" height="43" fill="url(#pattern0_12_342)" fill-opacity="0.6"/>
                      <defs>
                      <pattern id="pattern0_12_342" patternContentUnits="objectBoundingBox" width="1" height="1">
                      <use xlink:href="#image0_12_342" transform="matrix(0.0111111 0 0 0.00490956 0 0.27907)"/>
                      </pattern>
                      <image id="image0_12_342" width="90" height="90" preserveAspectRatio="none" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAABaCAYAAAA4qEECAAAACXBIWXMAAAsTAAALEwEAmpwYAAAD5klEQVR4nO2dy2oUQRSGP4iaiLetN1BRX8DLyohBohAVjAsVogHvmwiJiq7dqUGjBHwNb1kYzANERYlRF24UF941F1cmEFNScoQ4TIfR6a463XM++DdhZnLOT1NdVX3qNBiGYRiGYRiGYRgVUwdsBo4D3cAd4DnwGhgFJkWj8rfn8pkr8p1N8htGGVYCXUAf8B1wVWocuAd0AiuoceYD7cAA8DMFc5M0BTwADgMN1BAL5Up7n6G5SfoCXASWUGDmAueBkQgGl8rHcE5iKhRbgRcKDC7VK6CZAuDHxJvAtAJTk+Rj6wXqySmrgYcKjHQV6imwjpzRnNI0zQWWnxZuJyfsA34oMM39p/xi6CDKOZXxnNgFks/hJEpplcVBbJNcimYfQBl+XJtQYI7LYBjZiRLW5/TG5/7hBrk2tsn1Mi1yBdeT2PPsmwpMcIHkFzVR2BZhxTcI9IgGA/9vn2tjaJP9ZszLgEmOAS1l4tglY2ioOPxDhjkhjT4f+GpqmSWW3YFjORPK5EWBtzoHK4jpUcB4vsqeeuZcCHwFXa0gpmuBY/J72Zk/fvqk0OiewDF9yPqxWHvghJzCoeOPDmVp9ECEhJzMLpLYEymm/ixLAmLtzI3L7KKcySGndzPlN9CWZWF0V6SE3Aw9kvH4OvBYQTynszC6T0FiTplupW1ynazOYifmlGks7fKzzQqSckq1MU2jTyhIyCnV0TSN7laQkFOqS2kafVdBQq4WbojDChJySjWUptFvFSSUROy43pAiGipAk4gdl982TY1JBQklETsuX2aRGmY0YYy2oYMwQ4fdDAlzM9QwvUuiUNM7DQuWJAq1YNGwBE+iUEvw4woSSiJ2XEco2DZpErHj2kDBNv6TKNTGP3K22owm20dZyLFiM5q/POjIwujlkc+oJBErHu/FUjLCdwkwo/ntwX0KVhLmlF7RbVka3RCp/YNTZvRHKfgsVBG6U2j0WQKwQLYGa9Xob6EK0ZFC7Fo1upOA+AMzzyIk6SLrRYyuNY3KG564lDUtR/6i0KvAABdIN4hIvRzfdQXXY2AekVkbsereBdqhW4MSmnLedcYlyJdZ7EAZewvYGGU/SjlZkFY/U1ITrprWnA8jExpb/MzW+mc8pze+JnLGqgg9NVwVeqKhpU818+xe5SvIaVmMRJ8np7VcH1Zgaql8TFsoGHOkqUiMLdZSfZVduKDdZEKzQJJ8F8Hgz9KoezE1RIO0YujPeKEzJQ9S22qt9Xw5lskB9tvyNopqzR2V3+rIsiQg79RJPdsx4LJUAw3Jq0BGZrweZET+NiSfuSynWP137fUghmEYhmEYhmEYVMgvbkcWtzNuJV4AAAAASUVORK5CYII="/>
                      </defs>
                    </svg>

                    <svg class="presentationIcon" width="20" height="38" viewBox="0 0 20 38" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                    <rect width="20" height="38" fill="url(#pattern0_12_334)" fill-opacity="0.6"/>
                    <defs>
                    <pattern id="pattern0_12_334" patternContentUnits="objectBoundingBox" width="1" height="1">
                    <use xlink:href="#image0_12_334" transform="matrix(0.0111111 0 0 0.00584795 0 0.236842)"/>
                    </pattern>
                    <image id="image0_12_334" width="90" height="90" preserveAspectRatio="none" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAABaCAYAAAA4qEECAAAACXBIWXMAAAsTAAALEwEAmpwYAAAC/UlEQVR4nO2czU4UQRRGT0AhCuMDgEvj+CYoe7cm/sS4EN2JjyGIP29B1MQ3EGGlb2AAdeFCNEQTVm0qU62GwExXddVUVc93kpvMhprLyc2t6ludASGEEEIIIYQohPPAM+AHUCnwcXAAbADnhol+KbmEKjDj8kSmgN8STSjRv6xTiSaRaLUOgop+MaxHmwb+1DZ0bYZ4OfgOrI/aDIUQQgghxo+Od3g5kGjGUzwSjUTTpTalikaiSV2FqmjSi1PrIL1U9WgkmpMkzAF9YMnOw/cyqMxOVvRxzBXQdeBTBuI6LbqmB7zKQF7nRdfVvZaBwM6LrmWXUtnO5JZcD/iSgcjsRO/a2+Ale6KYC5DcHYfvPwIeAQu0w/z9ql0vK9H7wC1g2mHNpkzb9ZvkYeSEZDUn0ZvAvMeaLmw0zKVtJR9nIRfRT4a9AmUJkdzyJIvebCCZQMn1E7WOx6lF749oF/8TIrlew7yOrOzObIY3I6xZFRxRRO+ecrqQ6MCi1yKsWRUezjRZ9KpEMxbRlySasYiej7BmVXhEEW2OWrHotfyHOzXruEw8+i1Fd2rW4boZxnjUnohHcHORGovnmYleTCl6z/GBpSlnHMahEzPruE147raU3MlZx+fAp48LwNcAolNFNNEm3gZqIVPA6wxkZSu6nntMtZS8noGo7EVX9pWAnme7eJOBpGJEm/gGPLQnhyZVfKPwnpxMdB379iL1GnDFzkXm7edl+0s3bY9wOcbYRU9qOJM64arQkGgkmtRVqIomvTi1DjrSow8zSLoqLH76iN7JIPGqsHjvI/pBBolXhcV9H9GzwMcMkq8KiQ/ADJ5clGyaSjZXXa0wlb1i+482SP7KNS62bLvwruQcqU4JIdFlUqmi4zMzRHSn+mNKFoDtIaK3I7wsM3GcBd41OF7t2NOR8OSewwODeelGeLLlINpUvvDkwPGXyIUnh7FHlMJ9VOs1ohQDVmKPKMWAWTsZizqiFAMWR8gOMqIUA2Zsa6hHtZ0dUQohBP/4A6YrM1LHqvH+AAAAAElFTkSuQmCC"/>
                    </defs>
                  </svg>

                </td>
                <td class="colomns">+15</td>
                <td class="colomns">+15</td>
              </tr>
              <tr>
                <td class="category">Målgruppe

                    <svg class="successIcon" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                      <rect width="20" height="20" fill="url(#pattern0_6_18)"/>
                      <defs>
                      <pattern id="pattern0_6_18" patternContentUnits="objectBoundingBox" width="1" height="1">
                      <use xlink:href="#image0_6_18" transform="scale(0.0111111)"/>
                      </pattern>
                      <image id="image0_6_18" width="90" height="90" preserveAspectRatio="none" xlink:href="data:image/png;base64,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"/>
                      </defs>
                    </svg>

                    <svg class="infoIcon"  viewBox="0 0 19 43"  xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                      <rect width="19" height="43" fill="url(#pattern0_12_342)" fill-opacity="0.6"/>
                      <defs>
                      <pattern id="pattern0_12_342" patternContentUnits="objectBoundingBox" width="1" height="1">
                      <use xlink:href="#image0_12_342" transform="matrix(0.0111111 0 0 0.00490956 0 0.27907)"/>
                      </pattern>
                      <image id="image0_12_342" width="90" height="90" preserveAspectRatio="none" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAABaCAYAAAA4qEECAAAACXBIWXMAAAsTAAALEwEAmpwYAAAD5klEQVR4nO2dy2oUQRSGP4iaiLetN1BRX8DLyohBohAVjAsVogHvmwiJiq7dqUGjBHwNb1kYzANERYlRF24UF941F1cmEFNScoQ4TIfR6a463XM++DdhZnLOT1NdVX3qNBiGYRiGYRiGYRgVUwdsBo4D3cAd4DnwGhgFJkWj8rfn8pkr8p1N8htGGVYCXUAf8B1wVWocuAd0AiuoceYD7cAA8DMFc5M0BTwADgMN1BAL5Up7n6G5SfoCXASWUGDmAueBkQgGl8rHcE5iKhRbgRcKDC7VK6CZAuDHxJvAtAJTk+Rj6wXqySmrgYcKjHQV6imwjpzRnNI0zQWWnxZuJyfsA34oMM39p/xi6CDKOZXxnNgFks/hJEpplcVBbJNcimYfQBl+XJtQYI7LYBjZiRLW5/TG5/7hBrk2tsn1Mi1yBdeT2PPsmwpMcIHkFzVR2BZhxTcI9IgGA/9vn2tjaJP9ZszLgEmOAS1l4tglY2ioOPxDhjkhjT4f+GpqmSWW3YFjORPK5EWBtzoHK4jpUcB4vsqeeuZcCHwFXa0gpmuBY/J72Zk/fvqk0OiewDF9yPqxWHvghJzCoeOPDmVp9ECEhJzMLpLYEymm/ixLAmLtzI3L7KKcySGndzPlN9CWZWF0V6SE3Aw9kvH4OvBYQTynszC6T0FiTplupW1ynazOYifmlGks7fKzzQqSckq1MU2jTyhIyCnV0TSN7laQkFOqS2kafVdBQq4WbojDChJySjWUptFvFSSUROy43pAiGipAk4gdl982TY1JBQklETsuX2aRGmY0YYy2oYMwQ4fdDAlzM9QwvUuiUNM7DQuWJAq1YNGwBE+iUEvw4woSSiJ2XEco2DZpErHj2kDBNv6TKNTGP3K22owm20dZyLFiM5q/POjIwujlkc+oJBErHu/FUjLCdwkwo/ntwX0KVhLmlF7RbVka3RCp/YNTZvRHKfgsVBG6U2j0WQKwQLYGa9Xob6EK0ZFC7Fo1upOA+AMzzyIk6SLrRYyuNY3KG564lDUtR/6i0KvAABdIN4hIvRzfdQXXY2AekVkbsereBdqhW4MSmnLedcYlyJdZ7EAZewvYGGU/SjlZkFY/U1ITrprWnA8jExpb/MzW+mc8pze+JnLGqgg9NVwVeqKhpU818+xe5SvIaVmMRJ8np7VcH1Zgaql8TFsoGHOkqUiMLdZSfZVduKDdZEKzQJJ8F8Hgz9KoezE1RIO0YujPeKEzJQ9S22qt9Xw5lskB9tvyNopqzR2V3+rIsiQg79RJPdsx4LJUAw3Jq0BGZrweZET+NiSfuSynWP137fUghmEYhmEYhmEYVMgvbkcWtzNuJV4AAAAASUVORK5CYII="/>
                      </defs>
                    </svg>

                    <svg class="presentationIcon" width="20" height="38" viewBox="0 0 20 38" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                    <rect width="20" height="38" fill="url(#pattern0_12_334)" fill-opacity="0.6"/>
                    <defs>
                    <pattern id="pattern0_12_334" patternContentUnits="objectBoundingBox" width="1" height="1">
                    <use xlink:href="#image0_12_334" transform="matrix(0.0111111 0 0 0.00584795 0 0.236842)"/>
                    </pattern>
                    <image id="image0_12_334" width="90" height="90" preserveAspectRatio="none" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAABaCAYAAAA4qEECAAAACXBIWXMAAAsTAAALEwEAmpwYAAAC/UlEQVR4nO2czU4UQRRGT0AhCuMDgEvj+CYoe7cm/sS4EN2JjyGIP29B1MQ3EGGlb2AAdeFCNEQTVm0qU62GwExXddVUVc93kpvMhprLyc2t6ludASGEEEIIIYQohPPAM+AHUCnwcXAAbADnhol+KbmEKjDj8kSmgN8STSjRv6xTiSaRaLUOgop+MaxHmwb+1DZ0bYZ4OfgOrI/aDIUQQgghxo+Od3g5kGjGUzwSjUTTpTalikaiSV2FqmjSi1PrIL1U9WgkmpMkzAF9YMnOw/cyqMxOVvRxzBXQdeBTBuI6LbqmB7zKQF7nRdfVvZaBwM6LrmWXUtnO5JZcD/iSgcjsRO/a2+Ale6KYC5DcHYfvPwIeAQu0w/z9ql0vK9H7wC1g2mHNpkzb9ZvkYeSEZDUn0ZvAvMeaLmw0zKVtJR9nIRfRT4a9AmUJkdzyJIvebCCZQMn1E7WOx6lF749oF/8TIrlew7yOrOzObIY3I6xZFRxRRO+ecrqQ6MCi1yKsWRUezjRZ9KpEMxbRlySasYiej7BmVXhEEW2OWrHotfyHOzXruEw8+i1Fd2rW4boZxnjUnohHcHORGovnmYleTCl6z/GBpSlnHMahEzPruE147raU3MlZx+fAp48LwNcAolNFNNEm3gZqIVPA6wxkZSu6nntMtZS8noGo7EVX9pWAnme7eJOBpGJEm/gGPLQnhyZVfKPwnpxMdB379iL1GnDFzkXm7edl+0s3bY9wOcbYRU9qOJM64arQkGgkmtRVqIomvTi1DjrSow8zSLoqLH76iN7JIPGqsHjvI/pBBolXhcV9H9GzwMcMkq8KiQ/ADJ5clGyaSjZXXa0wlb1i+482SP7KNS62bLvwruQcqU4JIdFlUqmi4zMzRHSn+mNKFoDtIaK3I7wsM3GcBd41OF7t2NOR8OSewwODeelGeLLlINpUvvDkwPGXyIUnh7FHlMJ9VOs1ohQDVmKPKMWAWTsZizqiFAMWR8gOMqIUA2Zsa6hHtZ0dUQohBP/4A6YrM1LHqvH+AAAAAElFTkSuQmCC"/>
                    </defs>
                  </svg>
                </td>
                <td class="colomns">+4</td>
                <td class="colomns">+4</td>
              </tr>
              <tr>
                <td class="category">ShowTell
                  <svg class="successIcon" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                      <rect width="20" height="20" fill="url(#pattern0_6_18)"/>
                      <defs>
                      <pattern id="pattern0_6_18" patternContentUnits="objectBoundingBox" width="1" height="1">
                      <use xlink:href="#image0_6_18" transform="scale(0.0111111)"/>
                      </pattern>
                      <image id="image0_6_18" width="90" height="90" preserveAspectRatio="none" xlink:href="data:image/png;base64,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"/>
                      </defs>
                    </svg>

                    <svg class="infoIcon"  viewBox="0 0 19 43"  xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                      <rect width="19" height="43" fill="url(#pattern0_12_342)" fill-opacity="0.6"/>
                      <defs>
                      <pattern id="pattern0_12_342" patternContentUnits="objectBoundingBox" width="1" height="1">
                      <use xlink:href="#image0_12_342" transform="matrix(0.0111111 0 0 0.00490956 0 0.27907)"/>
                      </pattern>
                      <image id="image0_12_342" width="90" height="90" preserveAspectRatio="none" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAABaCAYAAAA4qEECAAAACXBIWXMAAAsTAAALEwEAmpwYAAAD5klEQVR4nO2dy2oUQRSGP4iaiLetN1BRX8DLyohBohAVjAsVogHvmwiJiq7dqUGjBHwNb1kYzANERYlRF24UF941F1cmEFNScoQ4TIfR6a463XM++DdhZnLOT1NdVX3qNBiGYRiGYRiGYRgVUwdsBo4D3cAd4DnwGhgFJkWj8rfn8pkr8p1N8htGGVYCXUAf8B1wVWocuAd0AiuoceYD7cAA8DMFc5M0BTwADgMN1BAL5Up7n6G5SfoCXASWUGDmAueBkQgGl8rHcE5iKhRbgRcKDC7VK6CZAuDHxJvAtAJTk+Rj6wXqySmrgYcKjHQV6imwjpzRnNI0zQWWnxZuJyfsA34oMM39p/xi6CDKOZXxnNgFks/hJEpplcVBbJNcimYfQBl+XJtQYI7LYBjZiRLW5/TG5/7hBrk2tsn1Mi1yBdeT2PPsmwpMcIHkFzVR2BZhxTcI9IgGA/9vn2tjaJP9ZszLgEmOAS1l4tglY2ioOPxDhjkhjT4f+GpqmSWW3YFjORPK5EWBtzoHK4jpUcB4vsqeeuZcCHwFXa0gpmuBY/J72Zk/fvqk0OiewDF9yPqxWHvghJzCoeOPDmVp9ECEhJzMLpLYEymm/ixLAmLtzI3L7KKcySGndzPlN9CWZWF0V6SE3Aw9kvH4OvBYQTynszC6T0FiTplupW1ynazOYifmlGks7fKzzQqSckq1MU2jTyhIyCnV0TSN7laQkFOqS2kafVdBQq4WbojDChJySjWUptFvFSSUROy43pAiGipAk4gdl982TY1JBQklETsuX2aRGmY0YYy2oYMwQ4fdDAlzM9QwvUuiUNM7DQuWJAq1YNGwBE+iUEvw4woSSiJ2XEco2DZpErHj2kDBNv6TKNTGP3K22owm20dZyLFiM5q/POjIwujlkc+oJBErHu/FUjLCdwkwo/ntwX0KVhLmlF7RbVka3RCp/YNTZvRHKfgsVBG6U2j0WQKwQLYGa9Xob6EK0ZFC7Fo1upOA+AMzzyIk6SLrRYyuNY3KG564lDUtR/6i0KvAABdIN4hIvRzfdQXXY2AekVkbsereBdqhW4MSmnLedcYlyJdZ7EAZewvYGGU/SjlZkFY/U1ITrprWnA8jExpb/MzW+mc8pze+JnLGqgg9NVwVeqKhpU818+xe5SvIaVmMRJ8np7VcH1Zgaql8TFsoGHOkqUiMLdZSfZVduKDdZEKzQJJ8F8Hgz9KoezE1RIO0YujPeKEzJQ9S22qt9Xw5lskB9tvyNopqzR2V3+rIsiQg79RJPdsx4LJUAw3Jq0BGZrweZET+NiSfuSynWP137fUghmEYhmEYhmEYVMgvbkcWtzNuJV4AAAAASUVORK5CYII="/>
                      </defs>
                    </svg>

                    <svg class="presentationIcon" width="20" height="38" viewBox="0 0 20 38" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                    <rect width="20" height="38" fill="url(#pattern0_12_334)" fill-opacity="0.6"/>
                    <defs>
                    <pattern id="pattern0_12_334" patternContentUnits="objectBoundingBox" width="1" height="1">
                    <use xlink:href="#image0_12_334" transform="matrix(0.0111111 0 0 0.00584795 0 0.236842)"/>
                    </pattern>
                    <image id="image0_12_334" width="90" height="90" preserveAspectRatio="none" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAABaCAYAAAA4qEECAAAACXBIWXMAAAsTAAALEwEAmpwYAAAC/UlEQVR4nO2czU4UQRRGT0AhCuMDgEvj+CYoe7cm/sS4EN2JjyGIP29B1MQ3EGGlb2AAdeFCNEQTVm0qU62GwExXddVUVc93kpvMhprLyc2t6ludASGEEEIIIYQohPPAM+AHUCnwcXAAbADnhol+KbmEKjDj8kSmgN8STSjRv6xTiSaRaLUOgop+MaxHmwb+1DZ0bYZ4OfgOrI/aDIUQQgghxo+Od3g5kGjGUzwSjUTTpTalikaiSV2FqmjSi1PrIL1U9WgkmpMkzAF9YMnOw/cyqMxOVvRxzBXQdeBTBuI6LbqmB7zKQF7nRdfVvZaBwM6LrmWXUtnO5JZcD/iSgcjsRO/a2+Ale6KYC5DcHYfvPwIeAQu0w/z9ql0vK9H7wC1g2mHNpkzb9ZvkYeSEZDUn0ZvAvMeaLmw0zKVtJR9nIRfRT4a9AmUJkdzyJIvebCCZQMn1E7WOx6lF749oF/8TIrlew7yOrOzObIY3I6xZFRxRRO+ecrqQ6MCi1yKsWRUezjRZ9KpEMxbRlySasYiej7BmVXhEEW2OWrHotfyHOzXruEw8+i1Fd2rW4boZxnjUnohHcHORGovnmYleTCl6z/GBpSlnHMahEzPruE147raU3MlZx+fAp48LwNcAolNFNNEm3gZqIVPA6wxkZSu6nntMtZS8noGo7EVX9pWAnme7eJOBpGJEm/gGPLQnhyZVfKPwnpxMdB379iL1GnDFzkXm7edl+0s3bY9wOcbYRU9qOJM64arQkGgkmtRVqIomvTi1DjrSow8zSLoqLH76iN7JIPGqsHjvI/pBBolXhcV9H9GzwMcMkq8KiQ/ADJ5clGyaSjZXXa0wlb1i+482SP7KNS62bLvwruQcqU4JIdFlUqmi4zMzRHSn+mNKFoDtIaK3I7wsM3GcBd41OF7t2NOR8OSewwODeelGeLLlINpUvvDkwPGXyIUnh7FHlMJ9VOs1ohQDVmKPKMWAWTsZizqiFAMWR8gOMqIUA2Zsa6hHtZ0dUQohBP/4A6YrM1LHqvH+AAAAAElFTkSuQmCC"/>
                    </defs>
                  </svg>
                </td>
                <td class="colomns">+4</td>
                <td class="colomns">+3</td>
              </tr>
              <tr>
                <td class="category">Genre
                  <svg class="successIcon" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                      <rect width="20" height="20" fill="url(#pattern0_6_18)"/>
                      <defs>
                      <pattern id="pattern0_6_18" patternContentUnits="objectBoundingBox" width="1" height="1">
                      <use xlink:href="#image0_6_18" transform="scale(0.0111111)"/>
                      </pattern>
                      <image id="image0_6_18" width="90" height="90" preserveAspectRatio="none" xlink:href="data:image/png;base64,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"/>
                      </defs>
                    </svg>

                    <svg class="infoIcon"  viewBox="0 0 19 43"  xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                      <rect width="19" height="43" fill="url(#pattern0_12_342)" fill-opacity="0.6"/>
                      <defs>
                      <pattern id="pattern0_12_342" patternContentUnits="objectBoundingBox" width="1" height="1">
                      <use xlink:href="#image0_12_342" transform="matrix(0.0111111 0 0 0.00490956 0 0.27907)"/>
                      </pattern>
                      <image id="image0_12_342" width="90" height="90" preserveAspectRatio="none" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAABaCAYAAAA4qEECAAAACXBIWXMAAAsTAAALEwEAmpwYAAAD5klEQVR4nO2dy2oUQRSGP4iaiLetN1BRX8DLyohBohAVjAsVogHvmwiJiq7dqUGjBHwNb1kYzANERYlRF24UF941F1cmEFNScoQ4TIfR6a463XM++DdhZnLOT1NdVX3qNBiGYRiGYRiGYRgVUwdsBo4D3cAd4DnwGhgFJkWj8rfn8pkr8p1N8htGGVYCXUAf8B1wVWocuAd0AiuoceYD7cAA8DMFc5M0BTwADgMN1BAL5Up7n6G5SfoCXASWUGDmAueBkQgGl8rHcE5iKhRbgRcKDC7VK6CZAuDHxJvAtAJTk+Rj6wXqySmrgYcKjHQV6imwjpzRnNI0zQWWnxZuJyfsA34oMM39p/xi6CDKOZXxnNgFks/hJEpplcVBbJNcimYfQBl+XJtQYI7LYBjZiRLW5/TG5/7hBrk2tsn1Mi1yBdeT2PPsmwpMcIHkFzVR2BZhxTcI9IgGA/9vn2tjaJP9ZszLgEmOAS1l4tglY2ioOPxDhjkhjT4f+GpqmSWW3YFjORPK5EWBtzoHK4jpUcB4vsqeeuZcCHwFXa0gpmuBY/J72Zk/fvqk0OiewDF9yPqxWHvghJzCoeOPDmVp9ECEhJzMLpLYEymm/ixLAmLtzI3L7KKcySGndzPlN9CWZWF0V6SE3Aw9kvH4OvBYQTynszC6T0FiTplupW1ynazOYifmlGks7fKzzQqSckq1MU2jTyhIyCnV0TSN7laQkFOqS2kafVdBQq4WbojDChJySjWUptFvFSSUROy43pAiGipAk4gdl982TY1JBQklETsuX2aRGmY0YYy2oYMwQ4fdDAlzM9QwvUuiUNM7DQuWJAq1YNGwBE+iUEvw4woSSiJ2XEco2DZpErHj2kDBNv6TKNTGP3K22owm20dZyLFiM5q/POjIwujlkc+oJBErHu/FUjLCdwkwo/ntwX0KVhLmlF7RbVka3RCp/YNTZvRHKfgsVBG6U2j0WQKwQLYGa9Xob6EK0ZFC7Fo1upOA+AMzzyIk6SLrRYyuNY3KG564lDUtR/6i0KvAABdIN4hIvRzfdQXXY2AekVkbsereBdqhW4MSmnLedcYlyJdZ7EAZewvYGGU/SjlZkFY/U1ITrprWnA8jExpb/MzW+mc8pze+JnLGqgg9NVwVeqKhpU818+xe5SvIaVmMRJ8np7VcH1Zgaql8TFsoGHOkqUiMLdZSfZVduKDdZEKzQJJ8F8Hgz9KoezE1RIO0YujPeKEzJQ9S22qt9Xw5lskB9tvyNopqzR2V3+rIsiQg79RJPdsx4LJUAw3Jq0BGZrweZET+NiSfuSynWP137fUghmEYhmEYhmEYVMgvbkcWtzNuJV4AAAAASUVORK5CYII="/>
                      </defs>
                    </svg>

                    <svg class="presentationIcon" width="20" height="38" viewBox="0 0 20 38" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                    <rect width="20" height="38" fill="url(#pattern0_12_334)" fill-opacity="0.6"/>
                    <defs>
                    <pattern id="pattern0_12_334" patternContentUnits="objectBoundingBox" width="1" height="1">
                    <use xlink:href="#image0_12_334" transform="matrix(0.0111111 0 0 0.00584795 0 0.236842)"/>
                    </pattern>
                    <image id="image0_12_334" width="90" height="90" preserveAspectRatio="none" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAABaCAYAAAA4qEECAAAACXBIWXMAAAsTAAALEwEAmpwYAAAC/UlEQVR4nO2czU4UQRRGT0AhCuMDgEvj+CYoe7cm/sS4EN2JjyGIP29B1MQ3EGGlb2AAdeFCNEQTVm0qU62GwExXddVUVc93kpvMhprLyc2t6ludASGEEEIIIYQohPPAM+AHUCnwcXAAbADnhol+KbmEKjDj8kSmgN8STSjRv6xTiSaRaLUOgop+MaxHmwb+1DZ0bYZ4OfgOrI/aDIUQQgghxo+Od3g5kGjGUzwSjUTTpTalikaiSV2FqmjSi1PrIL1U9WgkmpMkzAF9YMnOw/cyqMxOVvRxzBXQdeBTBuI6LbqmB7zKQF7nRdfVvZaBwM6LrmWXUtnO5JZcD/iSgcjsRO/a2+Ale6KYC5DcHYfvPwIeAQu0w/z9ql0vK9H7wC1g2mHNpkzb9ZvkYeSEZDUn0ZvAvMeaLmw0zKVtJR9nIRfRT4a9AmUJkdzyJIvebCCZQMn1E7WOx6lF749oF/8TIrlew7yOrOzObIY3I6xZFRxRRO+ecrqQ6MCi1yKsWRUezjRZ9KpEMxbRlySasYiej7BmVXhEEW2OWrHotfyHOzXruEw8+i1Fd2rW4boZxnjUnohHcHORGovnmYleTCl6z/GBpSlnHMahEzPruE147raU3MlZx+fAp48LwNcAolNFNNEm3gZqIVPA6wxkZSu6nntMtZS8noGo7EVX9pWAnme7eJOBpGJEm/gGPLQnhyZVfKPwnpxMdB379iL1GnDFzkXm7edl+0s3bY9wOcbYRU9qOJM64arQkGgkmtRVqIomvTi1DjrSow8zSLoqLH76iN7JIPGqsHjvI/pBBolXhcV9H9GzwMcMkq8KiQ/ADJ5clGyaSjZXXa0wlb1i+482SP7KNS62bLvwruQcqU4JIdFlUqmi4zMzRHSn+mNKFoDtIaK3I7wsM3GcBd41OF7t2NOR8OSewwODeelGeLLlINpUvvDkwPGXyIUnh7FHlMJ9VOs1ohQDVmKPKMWAWTsZizqiFAMWR8gOMqIUA2Zsa6hHtZ0dUQohBP/4A6YrM1LHqvH+AAAAAElFTkSuQmCC"/>
                    </defs>
                  </svg>
                </td>
                <td class="colomns">+2</td>
                <td class="colomns">+2</td>
              </tr>
              <tr>
                <td class="category">Stærke ord
                  <svg class="successIcon" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                      <rect width="20" height="20" fill="url(#pattern0_6_18)"/>
                      <defs>
                      <pattern id="pattern0_6_18" patternContentUnits="objectBoundingBox" width="1" height="1">
                      <use xlink:href="#image0_6_18" transform="scale(0.0111111)"/>
                      </pattern>
                      <image id="image0_6_18" width="90" height="90" preserveAspectRatio="none" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAABaCAYAAAA4qEECAAAACXBIWXMAAAsTAAALEwEAmpwYAAAF8UlEQVR4nO2dS4gdRRSGf9/ieyH42rgRNYpxFAXxhW/iA/GxEYnxiSLu1YXoTszOhSYBwZVCRs30OT3EN4O6NOrcSUxQ0En6VE8MxmQkQiYBaTk9PebOnZl7+/bt7qqa6R8O3MXcqlNfV9dUnTpVF2jUqFGjRo0aNWrUJhNgSBihYUyrpZ8DDLX/TaMBFYe42RBmDCOZZ4SZKMAtg5bfCMC+YZxhCLIA8jHY5s8AZzawBpQw3loScmZCWN+AzhSFuFIYj+irngzjhDxgpkZxuWEc6QXaMI7uIVyRp0ytW31QX/J+xwtFIS4yjK/n9UBGFBOe6QZ8cgTnGMJ4DshzQ8i4fqcrYMazWnfH2/DVngAXwmdNjuFUw5joAmhCAtyXJDhu7jv6OSbcJYRduSEfg7YrZtzdWZ7W0dUPwvivW3EKfJUhrMsFiBEJIxACd/3Hl793i5aVltnRg7v4sBa+yhA2DgyNazLCRvgqYWy2DpBzDjuMzfBVhrDFox69Bb4qHXN96dEEhq8Swre2AZr89g18ndoJ4W8HACY5bdrLKV5MeMkBeEmf9iJ8UhTieiH84wC4pB9TnyPGdfBhuNCe7CNk0wZbe7b1YSRbVj9lGJsMY1hNg/BC+M6zMTnpYdPpP3PCx3PtTBdghHWVP4Q0QETY7gCExLK1dn+CCyoD3RmFW8kmjC8riyfbbpxxzDReXjpoCfGo7YYZx0wID5cOWnclbDfMOGYx46bSQSdjODFvbHdFGEHybsn1Ld0Kst5AdsOUBaqSPsEeW1MrwoSwU99wVKls/y1Z0Ua4H1Ur3ez0bawmzAjh5clRnK+mn3OmMSzWm/e0b/5WKp8C+kYhM9YsaAPjlUKgGYS6ZBijPkNW6RK6IOgQdUhfm1JSAtge5EFAp9O6OoaOKMQ9vkNWCeHVouVrgg+qlKZcFckgMq5BZqxZNA24j+ndb8M4uxLImhCo4cGVDtkcq2t8KsCq0gDHjNOE8EYpznGlptO1B3oOe4TDJdZ51BDe3r8VZw0EOWLcqoneDkBMnOnJi9dvCp88iBnXVOGYzOZ6vJDtkn/vPeQ2P8woru4bdHYwp2xnPpiXUjsbEXzPe8hznYgR9A06O/1UqiN7R3BxZz3J6zi+EGzHIGc+HSgC+mDJT/vfHcM4ebG6+obtIuRZv/5yIp4hhNuXqi83bFchFx46AgyV7awQfokZ5xaG7TBknTZKiNUY4CBl2XGNViHYbkOWgfcPq1iwCGGnxoV7xLzftbwYyb1gKfVAqeYwCOPH2ns2udmTlUUleR0qDaQI4+daYYfdxz1Lw8WOgZfdvWQC3Fmy061usJ2cXQS4DZ7uGbb6hW0NMmF3bXuGFW1ltfLCtja7KDpXdnBzttULtk3ItR6TqyHdoLUUbOuQZ3v077UMHZo8UkODWn8QzltQryObD72mm16lhAljnyG8ZghPCuN9DUrZBtzeESpLcFRJgOccaGTihAV4uhLI+gS9SwXj6ixNDauiV6cBJgcaaNyyG0oHrXcQOdCwxCWLCQ9WlddhvXHGIZMQl6AK6ZEv240z7tinqEp6m1ZfN3ctUxPCD53z/NKlx3P1oichbPj/iDJhJMvXKH3n3Nizg9ombVtbOzdEIR5fapO5NulD0APrXh+6ZxzSBB/rh+7zSK9i8BG2MA5NjeJa+CTt2R6Cfh6+KRtG/BmzCQesj71FpRdCeQR6DL7Kp9NbQhiBr/LsgsGP4Ks8uzLzQ/iqbFGT+GBCeAe+SkI8kbM3TaarSwaVEfPOrkmmbMW6O893YsJj8FXpFK97bGRCQtzbebG2YdxRKCOKsF1Tgxe9qLvLpVsau9i2CSfBZ+kJVWF80e/V82n6GeGnPl79bd2SDeeunl+QHUv4rPIAUZ2KGZdFIR6KCTfm/jGFAKvSjM3eoI9o+XnK1Lo1xVZ9MQEuHbhhy0VCWJ9jyHjTtp/L/gdvhBHt/Ryn2/ZzWSjSG8oWSzInHNahyLZ/y0oSYrVO2fTkkzD2Z1O3q2z71ahRo0aNGjVqBKf0H+PniZMLyOz+AAAAAElFTkSuQmCC"/>
                      </defs>
                    </svg>

                    <svg class="infoIcon"  viewBox="0 0 19 43"  xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                      <rect width="19" height="43" fill="url(#pattern0_12_342)" fill-opacity="0.6"/>
                      <defs>
                      <pattern id="pattern0_12_342" patternContentUnits="objectBoundingBox" width="1" height="1">
                      <use xlink:href="#image0_12_342" transform="matrix(0.0111111 0 0 0.00490956 0 0.27907)"/>
                      </pattern>
                      <image id="image0_12_342" width="90" height="90" preserveAspectRatio="none" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAABaCAYAAAA4qEECAAAACXBIWXMAAAsTAAALEwEAmpwYAAAD5klEQVR4nO2dy2oUQRSGP4iaiLetN1BRX8DLyohBohAVjAsVogHvmwiJiq7dqUGjBHwNb1kYzANERYlRF24UF941F1cmEFNScoQ4TIfR6a463XM++DdhZnLOT1NdVX3qNBiGYRiGYRiGYRgVUwdsBo4D3cAd4DnwGhgFJkWj8rfn8pkr8p1N8htGGVYCXUAf8B1wVWocuAd0AiuoceYD7cAA8DMFc5M0BTwADgMN1BAL5Up7n6G5SfoCXASWUGDmAueBkQgGl8rHcE5iKhRbgRcKDC7VK6CZAuDHxJvAtAJTk+Rj6wXqySmrgYcKjHQV6imwjpzRnNI0zQWWnxZuJyfsA34oMM39p/xi6CDKOZXxnNgFks/hJEpplcVBbJNcimYfQBl+XJtQYI7LYBjZiRLW5/TG5/7hBrk2tsn1Mi1yBdeT2PPsmwpMcIHkFzVR2BZhxTcI9IgGA/9vn2tjaJP9ZszLgEmOAS1l4tglY2ioOPxDhjkhjT4f+GpqmSWW3YFjORPK5EWBtzoHK4jpUcB4vsqeeuZcCHwFXa0gpmuBY/J72Zk/fvqk0OiewDF9yPqxWHvghJzCoeOPDmVp9ECEhJzMLpLYEymm/ixLAmLtzI3L7KKcySGndzPlN9CWZWF0V6SE3Aw9kvH4OvBYQTynszC6T0FiTplupW1ynazOYifmlGks7fKzzQqSckq1MU2jTyhIyCnV0TSN7laQkFOqS2kafVdBQq4WbojDChJySjWUptFvFSSUROy43pAiGipAk4gdl982TY1JBQklETsuX2aRGmY0YYy2oYMwQ4fdDAlzM9QwvUuiUNM7DQuWJAq1YNGwBE+iUEvw4woSSiJ2XEco2DZpErHj2kDBNv6TKNTGP3K22owm20dZyLFiM5q/POjIwujlkc+oJBErHu/FUjLCdwkwo/ntwX0KVhLmlF7RbVka3RCp/YNTZvRHKfgsVBG6U2j0WQKwQLYGa9Xob6EK0ZFC7Fo1upOA+AMzzyIk6SLrRYyuNY3KG564lDUtR/6i0KvAABdIN4hIvRzfdQXXY2AekVkbsereBdqhW4MSmnLedcYlyJdZ7EAZewvYGGU/SjlZkFY/U1ITrprWnA8jExpb/MzW+mc8pze+JnLGqgg9NVwVeqKhpU818+xe5SvIaVmMRJ8np7VcH1Zgaql8TFsoGHOkqUiMLdZSfZVduKDdZEKzQJJ8F8Hgz9KoezE1RIO0YujPeKEzJQ9S22qt9Xw5lskB9tvyNopqzR2V3+rIsiQg79RJPdsx4LJUAw3Jq0BGZrweZET+NiSfuSynWP137fUghmEYhmEYhmEYVMgvbkcWtzNuJV4AAAAASUVORK5CYII="/>
                      </defs>
                    </svg>

                    <svg class="presentationIcon" width="20" height="38" viewBox="0 0 20 38" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                    <rect width="20" height="38" fill="url(#pattern0_12_334)" fill-opacity="0.6"/>
                    <defs>
                    <pattern id="pattern0_12_334" patternContentUnits="objectBoundingBox" width="1" height="1">
                    <use xlink:href="#image0_12_334" transform="matrix(0.0111111 0 0 0.00584795 0 0.236842)"/>
                    </pattern>
                    <image id="image0_12_334" width="90" height="90" preserveAspectRatio="none" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAABaCAYAAAA4qEECAAAACXBIWXMAAAsTAAALEwEAmpwYAAAC/UlEQVR4nO2czU4UQRRGT0AhCuMDgEvj+CYoe7cm/sS4EN2JjyGIP29B1MQ3EGGlb2AAdeFCNEQTVm0qU62GwExXddVUVc93kpvMhprLyc2t6ludASGEEEIIIYQohPPAM+AHUCnwcXAAbADnhol+KbmEKjDj8kSmgN8STSjRv6xTiSaRaLUOgop+MaxHmwb+1DZ0bYZ4OfgOrI/aDIUQQgghxo+Od3g5kGjGUzwSjUTTpTalikaiSV2FqmjSi1PrIL1U9WgkmpMkzAF9YMnOw/cyqMxOVvRxzBXQdeBTBuI6LbqmB7zKQF7nRdfVvZaBwM6LrmWXUtnO5JZcD/iSgcjsRO/a2+Ale6KYC5DcHYfvPwIeAQu0w/z9ql0vK9H7wC1g2mHNpkzb9ZvkYeSEZDUn0ZvAvMeaLmw0zKVtJR9nIRfRT4a9AmUJkdzyJIvebCCZQMn1E7WOx6lF749oF/8TIrlew7yOrOzObIY3I6xZFRxRRO+ecrqQ6MCi1yKsWRUezjRZ9KpEMxbRlySasYiej7BmVXhEEW2OWrHotfyHOzXruEw8+i1Fd2rW4boZxnjUnohHcHORGovnmYleTCl6z/GBpSlnHMahEzPruE147raU3MlZx+fAp48LwNcAolNFNNEm3gZqIVPA6wxkZSu6nntMtZS8noGo7EVX9pWAnme7eJOBpGJEm/gGPLQnhyZVfKPwnpxMdB379iL1GnDFzkXm7edl+0s3bY9wOcbYRU9qOJM64arQkGgkmtRVqIomvTi1DjrSow8zSLoqLH76iN7JIPGqsHjvI/pBBolXhcV9H9GzwMcMkq8KiQ/ADJ5clGyaSjZXXa0wlb1i+482SP7KNS62bLvwruQcqU4JIdFlUqmi4zMzRHSn+mNKFoDtIaK3I7wsM3GcBd41OF7t2NOR8OSewwODeelGeLLlINpUvvDkwPGXyIUnh7FHlMJ9VOs1ohQDVmKPKMWAWTsZizqiFAMWR8gOMqIUA2Zsa6hHtZ0dUQohBP/4A6YrM1LHqvH+AAAAAElFTkSuQmCC"/>
                    </defs>
                  </svg>
                </td>
                <td class="colomns">+2</td>
                <td class="colomns">+2</td>
              </tr>
              <tr>
                <td class="category">Dialog
                  <svg class="successIcon" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                      <rect width="20" height="20" fill="url(#pattern0_6_18)"/>
                      <defs>
                      <pattern id="pattern0_6_18" patternContentUnits="objectBoundingBox" width="1" height="1">
                      <use xlink:href="#image0_6_18" transform="scale(0.0111111)"/>
                      </pattern>
                      <image id="image0_6_18" width="90" height="90" preserveAspectRatio="none" xlink:href="data:image/png;base64,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"/>
                      </defs>
                    </svg>

                    <svg class="infoIcon"  viewBox="0 0 19 43"  xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                      <rect width="19" height="43" fill="url(#pattern0_12_342)" fill-opacity="0.6"/>
                      <defs>
                      <pattern id="pattern0_12_342" patternContentUnits="objectBoundingBox" width="1" height="1">
                      <use xlink:href="#image0_12_342" transform="matrix(0.0111111 0 0 0.00490956 0 0.27907)"/>
                      </pattern>
                      <image id="image0_12_342" width="90" height="90" preserveAspectRatio="none" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAABaCAYAAAA4qEECAAAACXBIWXMAAAsTAAALEwEAmpwYAAAD5klEQVR4nO2dy2oUQRSGP4iaiLetN1BRX8DLyohBohAVjAsVogHvmwiJiq7dqUGjBHwNb1kYzANERYlRF24UF941F1cmEFNScoQ4TIfR6a463XM++DdhZnLOT1NdVX3qNBiGYRiGYRiGYRgVUwdsBo4D3cAd4DnwGhgFJkWj8rfn8pkr8p1N8htGGVYCXUAf8B1wVWocuAd0AiuoceYD7cAA8DMFc5M0BTwADgMN1BAL5Up7n6G5SfoCXASWUGDmAueBkQgGl8rHcE5iKhRbgRcKDC7VK6CZAuDHxJvAtAJTk+Rj6wXqySmrgYcKjHQV6imwjpzRnNI0zQWWnxZuJyfsA34oMM39p/xi6CDKOZXxnNgFks/hJEpplcVBbJNcimYfQBl+XJtQYI7LYBjZiRLW5/TG5/7hBrk2tsn1Mi1yBdeT2PPsmwpMcIHkFzVR2BZhxTcI9IgGA/9vn2tjaJP9ZszLgEmOAS1l4tglY2ioOPxDhjkhjT4f+GpqmSWW3YFjORPK5EWBtzoHK4jpUcB4vsqeeuZcCHwFXa0gpmuBY/J72Zk/fvqk0OiewDF9yPqxWHvghJzCoeOPDmVp9ECEhJzMLpLYEymm/ixLAmLtzI3L7KKcySGndzPlN9CWZWF0V6SE3Aw9kvH4OvBYQTynszC6T0FiTplupW1ynazOYifmlGks7fKzzQqSckq1MU2jTyhIyCnV0TSN7laQkFOqS2kafVdBQq4WbojDChJySjWUptFvFSSUROy43pAiGipAk4gdl982TY1JBQklETsuX2aRGmY0YYy2oYMwQ4fdDAlzM9QwvUuiUNM7DQuWJAq1YNGwBE+iUEvw4woSSiJ2XEco2DZpErHj2kDBNv6TKNTGP3K22owm20dZyLFiM5q/POjIwujlkc+oJBErHu/FUjLCdwkwo/ntwX0KVhLmlF7RbVka3RCp/YNTZvRHKfgsVBG6U2j0WQKwQLYGa9Xob6EK0ZFC7Fo1upOA+AMzzyIk6SLrRYyuNY3KG564lDUtR/6i0KvAABdIN4hIvRzfdQXXY2AekVkbsereBdqhW4MSmnLedcYlyJdZ7EAZewvYGGU/SjlZkFY/U1ITrprWnA8jExpb/MzW+mc8pze+JnLGqgg9NVwVeqKhpU818+xe5SvIaVmMRJ8np7VcH1Zgaql8TFsoGHOkqUiMLdZSfZVduKDdZEKzQJJ8F8Hgz9KoezE1RIO0YujPeKEzJQ9S22qt9Xw5lskB9tvyNopqzR2V3+rIsiQg79RJPdsx4LJUAw3Jq0BGZrweZET+NiSfuSynWP137fUghmEYhmEYhmEYVMgvbkcWtzNuJV4AAAAASUVORK5CYII="/>
                      </defs>
                    </svg>

                    <svg class="presentationIcon" width="20" height="38" viewBox="0 0 20 38" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                    <rect width="20" height="38" fill="url(#pattern0_12_334)" fill-opacity="0.6"/>
                    <defs>
                    <pattern id="pattern0_12_334" patternContentUnits="objectBoundingBox" width="1" height="1">
                    <use xlink:href="#image0_12_334" transform="matrix(0.0111111 0 0 0.00584795 0 0.236842)"/>
                    </pattern>
                    <image id="image0_12_334" width="90" height="90" preserveAspectRatio="none" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAABaCAYAAAA4qEECAAAACXBIWXMAAAsTAAALEwEAmpwYAAAC/UlEQVR4nO2czU4UQRRGT0AhCuMDgEvj+CYoe7cm/sS4EN2JjyGIP29B1MQ3EGGlb2AAdeFCNEQTVm0qU62GwExXddVUVc93kpvMhprLyc2t6ludASGEEEIIIYQohPPAM+AHUCnwcXAAbADnhol+KbmEKjDj8kSmgN8STSjRv6xTiSaRaLUOgop+MaxHmwb+1DZ0bYZ4OfgOrI/aDIUQQgghxo+Od3g5kGjGUzwSjUTTpTalikaiSV2FqmjSi1PrIL1U9WgkmpMkzAF9YMnOw/cyqMxOVvRxzBXQdeBTBuI6LbqmB7zKQF7nRdfVvZaBwM6LrmWXUtnO5JZcD/iSgcjsRO/a2+Ale6KYC5DcHYfvPwIeAQu0w/z9ql0vK9H7wC1g2mHNpkzb9ZvkYeSEZDUn0ZvAvMeaLmw0zKVtJR9nIRfRT4a9AmUJkdzyJIvebCCZQMn1E7WOx6lF749oF/8TIrlew7yOrOzObIY3I6xZFRxRRO+ecrqQ6MCi1yKsWRUezjRZ9KpEMxbRlySasYiej7BmVXhEEW2OWrHotfyHOzXruEw8+i1Fd2rW4boZxnjUnohHcHORGovnmYleTCl6z/GBpSlnHMahEzPruE147raU3MlZx+fAp48LwNcAolNFNNEm3gZqIVPA6wxkZSu6nntMtZS8noGo7EVX9pWAnme7eJOBpGJEm/gGPLQnhyZVfKPwnpxMdB379iL1GnDFzkXm7edl+0s3bY9wOcbYRU9qOJM64arQkGgkmtRVqIomvTi1DjrSow8zSLoqLH76iN7JIPGqsHjvI/pBBolXhcV9H9GzwMcMkq8KiQ/ADJ5clGyaSjZXXa0wlb1i+482SP7KNS62bLvwruQcqU4JIdFlUqmi4zMzRHSn+mNKFoDtIaK3I7wsM3GcBd41OF7t2NOR8OSewwODeelGeLLlINpUvvDkwPGXyIUnh7FHlMJ9VOs1ohQDVmKPKMWAWTsZizqiFAMWR8gOMqIUA2Zsa6hHtZ0dUQohBP/4A6YrM1LHqvH+AAAAAElFTkSuQmCC"/>
                    </defs>
                  </svg>
                </td>
                <td class="colomns">+2</td>
                <td class="colomns">+2</td>
              </tr>
              <tr>
                <td class="category">Tempo
                  <svg class="successIcon" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                      <rect width="20" height="20" fill="url(#pattern0_6_18)"/>
                      <defs>
                      <pattern id="pattern0_6_18" patternContentUnits="objectBoundingBox" width="1" height="1">
                      <use xlink:href="#image0_6_18" transform="scale(0.0111111)"/>
                      </pattern>
                      <image id="image0_6_18" width="90" height="90" preserveAspectRatio="none" xlink:href="data:image/png;base64,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"/>
                      </defs>
                    </svg>

                    <svg class="infoIcon"  viewBox="0 0 19 43"  xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                      <rect width="19" height="43" fill="url(#pattern0_12_342)" fill-opacity="0.6"/>
                      <defs>
                      <pattern id="pattern0_12_342" patternContentUnits="objectBoundingBox" width="1" height="1">
                      <use xlink:href="#image0_12_342" transform="matrix(0.0111111 0 0 0.00490956 0 0.27907)"/>
                      </pattern>
                      <image id="image0_12_342" width="90" height="90" preserveAspectRatio="none" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAABaCAYAAAA4qEECAAAACXBIWXMAAAsTAAALEwEAmpwYAAAD5klEQVR4nO2dy2oUQRSGP4iaiLetN1BRX8DLyohBohAVjAsVogHvmwiJiq7dqUGjBHwNb1kYzANERYlRF24UF941F1cmEFNScoQ4TIfR6a463XM++DdhZnLOT1NdVX3qNBiGYRiGYRiGYRgVUwdsBo4D3cAd4DnwGhgFJkWj8rfn8pkr8p1N8htGGVYCXUAf8B1wVWocuAd0AiuoceYD7cAA8DMFc5M0BTwADgMN1BAL5Up7n6G5SfoCXASWUGDmAueBkQgGl8rHcE5iKhRbgRcKDC7VK6CZAuDHxJvAtAJTk+Rj6wXqySmrgYcKjHQV6imwjpzRnNI0zQWWnxZuJyfsA34oMM39p/xi6CDKOZXxnNgFks/hJEpplcVBbJNcimYfQBl+XJtQYI7LYBjZiRLW5/TG5/7hBrk2tsn1Mi1yBdeT2PPsmwpMcIHkFzVR2BZhxTcI9IgGA/9vn2tjaJP9ZszLgEmOAS1l4tglY2ioOPxDhjkhjT4f+GpqmSWW3YFjORPK5EWBtzoHK4jpUcB4vsqeeuZcCHwFXa0gpmuBY/J72Zk/fvqk0OiewDF9yPqxWHvghJzCoeOPDmVp9ECEhJzMLpLYEymm/ixLAmLtzI3L7KKcySGndzPlN9CWZWF0V6SE3Aw9kvH4OvBYQTynszC6T0FiTplupW1ynazOYifmlGks7fKzzQqSckq1MU2jTyhIyCnV0TSN7laQkFOqS2kafVdBQq4WbojDChJySjWUptFvFSSUROy43pAiGipAk4gdl982TY1JBQklETsuX2aRGmY0YYy2oYMwQ4fdDAlzM9QwvUuiUNM7DQuWJAq1YNGwBE+iUEvw4woSSiJ2XEco2DZpErHj2kDBNv6TKNTGP3K22owm20dZyLFiM5q/POjIwujlkc+oJBErHu/FUjLCdwkwo/ntwX0KVhLmlF7RbVka3RCp/YNTZvRHKfgsVBG6U2j0WQKwQLYGa9Xob6EK0ZFC7Fo1upOA+AMzzyIk6SLrRYyuNY3KG564lDUtR/6i0KvAABdIN4hIvRzfdQXXY2AekVkbsereBdqhW4MSmnLedcYlyJdZ7EAZewvYGGU/SjlZkFY/U1ITrprWnA8jExpb/MzW+mc8pze+JnLGqgg9NVwVeqKhpU818+xe5SvIaVmMRJ8np7VcH1Zgaql8TFsoGHOkqUiMLdZSfZVduKDdZEKzQJJ8F8Hgz9KoezE1RIO0YujPeKEzJQ9S22qt9Xw5lskB9tvyNopqzR2V3+rIsiQg79RJPdsx4LJUAw3Jq0BGZrweZET+NiSfuSynWP137fUghmEYhmEYhmEYVMgvbkcWtzNuJV4AAAAASUVORK5CYII="/>
                      </defs>
                    </svg>

                    <svg class="presentationIcon" width="20" height="38" viewBox="0 0 20 38" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                    <rect width="20" height="38" fill="url(#pattern0_12_334)" fill-opacity="0.6"/>
                    <defs>
                    <pattern id="pattern0_12_334" patternContentUnits="objectBoundingBox" width="1" height="1">
                    <use xlink:href="#image0_12_334" transform="matrix(0.0111111 0 0 0.00584795 0 0.236842)"/>
                    </pattern>
                    <image id="image0_12_334" width="90" height="90" preserveAspectRatio="none" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAABaCAYAAAA4qEECAAAACXBIWXMAAAsTAAALEwEAmpwYAAAC/UlEQVR4nO2czU4UQRRGT0AhCuMDgEvj+CYoe7cm/sS4EN2JjyGIP29B1MQ3EGGlb2AAdeFCNEQTVm0qU62GwExXddVUVc93kpvMhprLyc2t6ludASGEEEIIIYQohPPAM+AHUCnwcXAAbADnhol+KbmEKjDj8kSmgN8STSjRv6xTiSaRaLUOgop+MaxHmwb+1DZ0bYZ4OfgOrI/aDIUQQgghxo+Od3g5kGjGUzwSjUTTpTalikaiSV2FqmjSi1PrIL1U9WgkmpMkzAF9YMnOw/cyqMxOVvRxzBXQdeBTBuI6LbqmB7zKQF7nRdfVvZaBwM6LrmWXUtnO5JZcD/iSgcjsRO/a2+Ale6KYC5DcHYfvPwIeAQu0w/z9ql0vK9H7wC1g2mHNpkzb9ZvkYeSEZDUn0ZvAvMeaLmw0zKVtJR9nIRfRT4a9AmUJkdzyJIvebCCZQMn1E7WOx6lF749oF/8TIrlew7yOrOzObIY3I6xZFRxRRO+ecrqQ6MCi1yKsWRUezjRZ9KpEMxbRlySasYiej7BmVXhEEW2OWrHotfyHOzXruEw8+i1Fd2rW4boZxnjUnohHcHORGovnmYleTCl6z/GBpSlnHMahEzPruE147raU3MlZx+fAp48LwNcAolNFNNEm3gZqIVPA6wxkZSu6nntMtZS8noGo7EVX9pWAnme7eJOBpGJEm/gGPLQnhyZVfKPwnpxMdB379iL1GnDFzkXm7edl+0s3bY9wOcbYRU9qOJM64arQkGgkmtRVqIomvTi1DjrSow8zSLoqLH76iN7JIPGqsHjvI/pBBolXhcV9H9GzwMcMkq8KiQ/ADJ5clGyaSjZXXa0wlb1i+482SP7KNS62bLvwruQcqU4JIdFlUqmi4zMzRHSn+mNKFoDtIaK3I7wsM3GcBd41OF7t2NOR8OSewwODeelGeLLlINpUvvDkwPGXyIUnh7FHlMJ9VOs1ohQDVmKPKMWAWTsZizqiFAMWR8gOMqIUA2Zsa6hHtZ0dUQohBP/4A6YrM1LHqvH+AAAAAElFTkSuQmCC"/>
                    </defs>
                  </svg>
                </td>
                <td class="colomns">+1</td>
                <td class="colomns">+1</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="3" class="lastTD">
                  <div class="GoodRead flex items-center px-4 py-2 relative">
                    <span class="GoodReadScore">Good Reads</span>
                    
                    <span class="ml-auto absolute top-0 right-0 mr-5 mt-1">8.3</span>
                  </div>
                </td>
              </tr>
            </tfoot>
          </table>
          <button class="buttonAnalyse">+ Ny AI Analyse</button>
        </div>
      </div>

      <div class="right">
        <div class="info bg-gray-100 rounded-xl p-6 text-center shadow-sm">
          <div class="justify-center m-auto">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
              <rect width="40" height="40" fill="url(#pattern0_1_317)"/>
              <defs>
              <pattern id="pattern0_1_317" patternContentUnits="objectBoundingBox" width="1" height="1">
              <use xlink:href="#image0_1_317" transform="scale(0.0111111)"/>
              </pattern>
              <image id="image0_1_317" width="90" height="90" preserveAspectRatio="none" xlink:href="data:image/png;base64,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"/>
              </defs>
            </svg>

          </div>
          <h2 class="font-semibold text-gray-900 mb-2">Lidt om Global Score</h2>
          <p class="text-base font-normal text-gray-900">
            Scoren giver dig en overordnet retning og er med til at indikere, hvor du kan forbedre dit manuskript. Udgivne bøger ligger typisk fra 75 og opefter. Du kan slå delrapporter fra, hvis de ikke er væsentlige for netop dit manuskript.
          </p>
        </div>

        <div class="info bg-gray-100 rounded-xl p-6 text-center shadow-sm mt-4">
          <div class="justify-center m-auto">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
              <rect width="40" height="40" fill="url(#pattern0_1_317)"/>
              <defs>
              <pattern id="pattern0_1_317" patternContentUnits="objectBoundingBox" width="1" height="1">
              <use xlink:href="#image0_1_317" transform="scale(0.0111111)"/>
              </pattern>
              <image id="image0_1_317" width="90" height="90" preserveAspectRatio="none" xlink:href="data:image/png;base64,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"/>
              </defs>
            </svg>
          </div>
          <h2 class="font-semibold text-gray-900 mb-2">Nyheder</h2>
          <h2 class="font-semibold text-gray-900 mb-2">Et trick til at forbedre showtell 15. April 2025</h2>
          <p class="text-base font-normal text-gray-900">
            Lange beskrivelser kan få dine læsere til at miste interessen og gøre din historie mindre levende og visuel.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
html, body {
  height: 100%;
  margin: 0;
}

.hello {
  color: black;
  margin-left: 60px;

}

.helloText{
  font-family: Spline Sans;
  font-weight: 500;
  font-size: 38px;
  line-height: 100%;
  letter-spacing: 0%;

}
.dots {
  font-family: Spline Sans;
  font-weight: 500;
  font-size: 38px;
  line-height: 100%;
  letter-spacing: 0%;
}
.component-wrapper {
  background-color: #fff;
  padding: 1rem;
  box-sizing: border-box;
}

.dropdown {
  border-radius: 1.5rem;
  background-color: #000;
  padding: 0.75rem 1rem;
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 90%;
  box-sizing: border-box;
}

 

.title {
  font-family: 'Spline Sans', sans-serif;
  font-size: clamp(1rem, 4vw, 1.5rem);
  color: #fff;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.colomns {
  text-align: center;
}

.progress-container {
  position: relative;
  background-color: #00000017;
  border-radius: 1.5rem;
  height: clamp(2.5rem, 8vw, 3.75rem);
  width: 100%;
  max-width: 90%;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  padding: 0 1rem;
  overflow: hidden;
}

.progress-bar {
  position: relative;
  display: block;
  background-color: #ffffff;
  border-radius: 1.5rem;
  height: 0.3125rem;
  width: 80%;
  max-width: 90%;
  top: -1rem;
  left: 1rem;
  margin: 0 auto;
}

.progress-bar-percentage {
  height: 100%;
  background-color: #E4B200BF;
  border-radius: 1.5rem 0 0 1.5rem;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 0.5rem;
  transition: width 0.3s ease;
  color: #000;
}

.percentage {
  position: relative;
  font-family: 'Spline Sans', sans-serif;
  font-weight: 600;
  font-size: clamp(1.25rem, 4vw, 2rem);
  line-height: 100%;
  top: -1rem;
  right: clamp(-2rem, -5vw, -1rem);
  color: black;
}

.waiting {
  font-family: 'Spline Sans', sans-serif;
  font-weight: 500;
  font-size: clamp(0.75rem, 2.5vw, 1rem);
  color: #00000059;
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: left;
}

.score-table {
  font-family: 'Spline Sans', sans-serif;
  width: 100%;
  max-width: 31rem;
  border-collapse: collapse;
  position: relative;
  padding: 0.625rem;
  border-radius: 1.5625rem;
  left: 0.625rem;
}

table {
  width: 100%;
  border-collapse: separate;
  border-radius: 1.5625rem;
  overflow: visible;
  color: #000;
  background-color: rgb(248, 248, 248);
}

.GoodRead {
  background-color: #e4b20030;
  margin: auto;
  width: 70%;
  height: 1.6875rem;
  border: 1px solid #e4b200;
  border-radius: 0.5625rem;
  padding: 0.625rem;
}

.GoodReadScore {
  position: relative;
  bottom: 0.4375rem;
  font-family: 'Spline Sans', sans-serif;
  font-weight: 600;
  font-size: clamp(0.875rem, 3vw, 1.1875rem);
  line-height: 100%;
  text-align: center;
}

th {
  background-color: #e4b20030;
  font-weight: bold;
  padding: 0.5rem;
}

.category {
  position: relative;
  padding-left: 1.5rem;
}

td .successIcon{
  position: absolute;
  left: -2.2rem;
}



td {
  background-color: #0000000d;
  height: 2.5rem;
  padding: 0.5rem;
}

.buttonAnalyse {
  position: absolute;
  width: 319px;
  height: 39px;
  background-color: #e4b20030;
  border-radius: 9px;
  border: 1px solid #e4b200;
  rotate: -90deg;
  left: calc(72%); 
  top: 50%;
  font-family: 'Spline Sans', sans-serif;
  color: #000;
  cursor: pointer;

  font-family: Spline Sans;
  font-weight: 900;
  font-size: 20px;
  line-height: 100%;
  letter-spacing: 0%;
  text-align: center;


}

.left {
  border-right: 1px solid #0000003d;
  width: 100%;
  max-width: 66.6666%;
  box-sizing: border-box;
  padding-right: 1rem;
}

.right {
  width: 100%;
  max-width: 33.3333%;
  box-sizing: border-box;
  padding-left: 1rem;

}

.info {
  margin: 1rem auto;
  width: 100%;
  max-width: 26.125rem;
  min-height: 22rem;
  padding: 1.5rem;
  border-radius: 1.5625rem;
  box-sizing: border-box;
}

.icon {
  width: clamp(3rem, 10vw, 5rem);
  height: clamp(3rem, 10vw, 5rem);
}

.infoIcon {
  position: absolute;
  width: 15px;
  bottom: 0px;
  margin: auto;
  left: 160px;
  cursor: pointer;

}
.presentationIcon{
  position: absolute;
  width: 15px;
  top: 4px;
  margin: auto;
  left: 180px;
  cursor: pointer;

}

/* Media Queries for Responsiveness */
@media (max-width: 768px) {
  .flex-row {
    flex-direction: column;
  }

  .left {
    border-right: none;
    border-bottom: 3px solid #0000003d;
    max-width: 100%;
    padding-right: 0;
    padding-bottom: 1rem;
  }

  .right {
    max-width: 100%;
    padding-left: 0;
    padding-top: 1rem;
  }

  .dropdown,
  .progress-container,
  .progress-bar {
    max-width: 95%;
  }

  .progress-bar {
    width: calc(100% - 1.5rem);
    left: 0.75rem;
  }

  .percentage {
    right: clamp(-1.5rem, -4vw, -0.5rem);
  }

  .waiting {
    font-size: clamp(0.625rem, 2.5vw, 0.875rem);
  }

  .info {
    max-width: 100%;
  }
}

@media (max-width: 480px) {
  .dropdown {
    padding: 0.5rem 0.75rem;
    border-radius: 1rem;
  }

  .title {
    font-size: clamp(0.875rem, 3.5vw, 1.125rem);
  }

  .progress-container {
    height: clamp(2rem, 7vw, 3rem);
    border-radius: 1rem;
    padding: 0 0.75rem;
  }

  .progress-bar {
    width: calc(100% - 1rem);
    left: 0.5rem;
    height: 0.25rem;
    top: -0.75rem;
  }

  .percentage {
    font-size: clamp(1rem, 3.5vw, 1.5rem);
    right: clamp(-1rem, -3vw, -0.25rem);
    top: -0.75rem;
  }

  .waiting {
    font-size: clamp(0.625rem, 2vw, 0.75rem);
  }

  .score-table {
    padding: 0.5rem;
  }

 

  td {
    font-size: clamp(0.75rem, 2.5vw, 0.875rem);
    padding: 0.25rem;
  }

  .GoodRead {
    width: 90%;
  }

  .info {
    padding: 1rem;
    min-height: 18rem;
  }
}
</style>