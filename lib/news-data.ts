export type NewsArticle = {
  id: number
  title: string
  summary: string
  location: string
  country: string
  lat: number
  lng: number
  genre: string
  genreColor: string
  image: string
  paperStyle: string
  tapePosition: string
  tornEdge: string
  rotation: string
}

export const newsArticles: NewsArticle[] = [
  {
    id: 1,
    title: "迷子の子犬、200km歩いて飼い主のもとへ帰還",
    summary:
      "アメリカ・オレゴン州で行方不明になったゴールデンレトリバーのバディが、3ヶ月かけて200kmを歩き、無事に飼い主の元へ帰ってきました。再会の瞬間、飼い主は涙を流しました。",
    location: "オレゴン州",
    country: "アメリカ",
    lat: 44.0,
    lng: -120.5,
    genre: "動物",
    genreColor: "bg-amber-200 text-amber-900",
    image: "/images/news-dog.jpg",
    paperStyle: "bg-[#f5ead0]",
    tapePosition: "tape-top-left",
    tornEdge: "torn-edge-1",
    rotation: "-rotate-1",
  },
  {
    id: 2,
    title: "80歳のパン職人、50年間毎朝子どもたちにパンを無料配布",
    summary:
      "東京の下町で小さなパン屋を営む佐藤さん（80歳）が、50年間毎朝、近所の子どもたちに焼きたてのパンを無料で配り続けています。「子どもたちの笑顔が一番のご褒美」と語ります。",
    location: "東京",
    country: "日本",
    lat: 35.68,
    lng: 139.76,
    genre: "人情",
    genreColor: "bg-rose-200 text-rose-900",
    image: "/images/news-bakery.jpg",
    paperStyle: "bg-[#dce8f0]",
    tapePosition: "tape-top-right",
    tornEdge: "torn-edge-2",
    rotation: "rotate-1",
  },
  {
    id: 3,
    title: "廃墟を花園に—市民300人の手で生まれ変わった広場",
    summary:
      "オランダ・アムステルダムの使われなくなった工場跡地が、300人以上のボランティアの手によって美しいコミュニティガーデンに生まれ変わりました。今では地域の憩いの場として親しまれています。",
    location: "アムステルダム",
    country: "オランダ",
    lat: 52.37,
    lng: 4.9,
    genre: "コミュニティ",
    genreColor: "bg-emerald-200 text-emerald-900",
    image: "/images/news-garden.jpg",
    paperStyle: "bg-[#e5f0e0]",
    tapePosition: "tape-top-left",
    tornEdge: "torn-edge-1",
    rotation: "rotate-0.5",
  },
  {
    id: 4,
    title: "赤ちゃんペンギン、初めての海にドキドキ",
    summary:
      "南極の研究基地近くで、今年生まれたコウテイペンギンの赤ちゃんたちが初めて海に足を踏み入れる瞬間が撮影されました。おそるおそる水に近づく姿が世界中で話題に。",
    location: "南極大陸",
    country: "南極",
    lat: -75.0,
    lng: 0.0,
    genre: "動物",
    genreColor: "bg-amber-200 text-amber-900",
    image: "/images/news-penguin.jpg",
    paperStyle: "bg-[#f0ece0]",
    tapePosition: "tape-top-right",
    tornEdge: "torn-edge-2",
    rotation: "-rotate-0.5",
  },
  {
    id: 5,
    title: "92歳のバイオリニスト、路上演奏で街を一つに",
    summary:
      "イタリア・フィレンツェの広場で毎夕方、92歳のマルコさんがバイオリンを演奏しています。その温かい音色に惹かれ、観光客も地元の人も立ち止まり、自然と笑顔の輪が広がっています。",
    location: "フィレンツェ",
    country: "イタリア",
    lat: 43.77,
    lng: 11.25,
    genre: "文化",
    genreColor: "bg-sky-200 text-sky-900",
    image: "/images/news-music.jpg",
    paperStyle: "bg-[#f5ead0]",
    tapePosition: "tape-bottom-right",
    tornEdge: "torn-edge-1",
    rotation: "rotate-1",
  },
  {
    id: 6,
    title: "消防士が木の上の子猫を救出、その後家族に",
    summary:
      "カナダ・バンクーバーで大木に取り残された子猫をレスキューした消防士のジェームズさん。子猫との絆が生まれ、正式に家族として迎え入れることを決めました。名前は「ブレイブ」。",
    location: "バンクーバー",
    country: "カナダ",
    lat: 49.28,
    lng: -123.12,
    genre: "勇気",
    genreColor: "bg-orange-200 text-orange-900",
    image: "/images/news-rescue.jpg",
    paperStyle: "bg-[#dce8f0]",
    tapePosition: "tape-top-left",
    tornEdge: "torn-edge-2",
    rotation: "-rotate-1",
  },
  {
    id: 7,
    title: "村の学校に届いた1000冊の本と子どもたちの笑顔",
    summary:
      "ケニアの小さな村の学校に、世界中の支援者から1000冊以上の本が届きました。初めて絵本を手にした子どもたちの輝く目と笑顔が、支援者たちの心を温めています。",
    location: "ナイロビ近郊",
    country: "ケニア",
    lat: -1.29,
    lng: 36.82,
    genre: "教育",
    genreColor: "bg-violet-200 text-violet-900",
    image: "/images/news-school.jpg",
    paperStyle: "bg-[#e5f0e0]",
    tapePosition: "tape-top-right",
    tornEdge: "torn-edge-1",
    rotation: "rotate-0.5",
  },
  {
    id: 8,
    title: "夜空に舞う灯籠、願いを込めて",
    summary:
      "タイ・チェンマイのイーペン祭りで、数千のコムローイ（天灯）が夜空に放たれました。平和と幸福を願う人々の温かい光が、満天の星のように輝きました。",
    location: "チェンマイ",
    country: "タイ",
    lat: 18.79,
    lng: 98.98,
    genre: "文化",
    genreColor: "bg-sky-200 text-sky-900",
    image: "/images/news-festival.jpg",
    paperStyle: "bg-[#f0ece0]",
    tapePosition: "tape-top-left",
    tornEdge: "torn-edge-2",
    rotation: "-rotate-0.5",
  },
]
