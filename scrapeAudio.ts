import axios from "axios";
import path from "path";
import fs from "fs";

const OUT_DIR = "./audio";

if (!fs.existsSync(OUT_DIR)) {
    fs.mkdirSync(OUT_DIR);
}

const URLS = [
    "https://cdn.pixabay.com/audio/2022/10/25/audio_3ea72d75c6.mp3",
    "https://cdn.pixabay.com/audio/2022/10/18/audio_31c2730e64.mp3",
    "https://cdn.pixabay.com/audio/2022/10/14/audio_9939f792cb.mp3",
    "https://cdn.pixabay.com/audio/2022/10/14/audio_84b5738b17.mp3",
    "https://cdn.pixabay.com/audio/2022/10/12/audio_061cead49a.mp3",
    "https://cdn.pixabay.com/audio/2022/10/05/audio_686ddcce85.mp3",
    "https://cdn.pixabay.com/audio/2022/08/31/audio_419263fc12.mp3",
    "https://cdn.pixabay.com/audio/2022/08/25/audio_4f3b0a816e.mp3",
    "https://cdn.pixabay.com/audio/2022/08/23/audio_d16737dc28.mp3",
    "https://cdn.pixabay.com/audio/2022/08/04/audio_2dde668d05.mp3",
    "https://cdn.pixabay.com/audio/2022/08/03/audio_54ca0ffa52.mp3",
    "https://cdn.pixabay.com/audio/2022/07/25/audio_3266b47d61.mp3",
    "https://cdn.pixabay.com/audio/2022/08/02/audio_884fe92c21.mp3",
    "https://cdn.pixabay.com/audio/2022/07/29/audio_1c5260dbf6.mp3",
    "https://cdn.pixabay.com/audio/2022/07/26/audio_112f2d606c.mp3",
    "https://cdn.pixabay.com/audio/2022/07/26/audio_ed0c111294.mp3",
    "https://cdn.pixabay.com/audio/2022/07/14/audio_b2e1adaa25.mp3",
    "https://cdn.pixabay.com/audio/2022/06/03/audio_c3d218496a.mp3",
    "https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf07a.mp3",
    "https://cdn.pixabay.com/audio/2022/05/17/audio_407815a564.mp3",
    "https://cdn.pixabay.com/audio/2022/05/16/audio_db6591201e.mp3",
    "https://cdn.pixabay.com/audio/2022/05/13/audio_c490e37598.mp3",
    "https://cdn.pixabay.com/audio/2022/05/05/audio_1395e7800f.mp3",
    "https://cdn.pixabay.com/audio/2022/04/30/audio_3c7238ff32.mp3",
    "https://cdn.pixabay.com/audio/2022/04/27/audio_30ff2fdf22.mp3",
    "https://cdn.pixabay.com/audio/2022/04/27/audio_67bcf729cf.mp3",
    "https://cdn.pixabay.com/audio/2022/03/23/audio_07b2a04be3.mp3",
    "https://cdn.pixabay.com/audio/2022/03/21/audio_50da5d4db6.mp3",
    "https://cdn.pixabay.com/audio/2022/03/10/audio_b195486a22.mp3",
    "https://cdn.pixabay.com/audio/2022/03/07/audio_20d7e20318.mp3",
    "https://cdn.pixabay.com/audio/2022/03/07/audio_79bd0ad83e.mp3",
    "https://cdn.pixabay.com/audio/2022/02/15/audio_1e79dbf2b9.mp3",
    "https://cdn.pixabay.com/audio/2022/02/10/audio_fc48af67b2.mp3",
    "https://cdn.pixabay.com/audio/2022/01/31/audio_0f2416122a.mp3",
    "https://cdn.pixabay.com/audio/2022/01/26/audio_d0c6ff1bdd.mp3",
    "https://cdn.pixabay.com/audio/2022/01/21/audio_31743c58bd.mp3",
    "https://cdn.pixabay.com/audio/2022/01/20/audio_743615ade2.mp3",
    "https://cdn.pixabay.com/audio/2022/01/18/audio_d0a13f69d2.mp3",
    "https://cdn.pixabay.com/audio/2022/01/18/audio_ea75bab6d8.mp3",
    "https://cdn.pixabay.com/audio/2022/01/11/audio_b21d9d6fa6.mp3",
    "https://cdn.pixabay.com/audio/2021/12/22/audio_9da2a60074.mp3",
    "https://cdn.pixabay.com/audio/2021/12/17/audio_93d90514a5.mp3",
    "https://cdn.pixabay.com/audio/2021/12/16/audio_232a4bdedf.mp3",
    "https://cdn.pixabay.com/audio/2021/12/16/audio_e13e329328.mp3",
    "https://cdn.pixabay.com/audio/2021/12/16/audio_e7d0534280.mp3",
    "https://cdn.pixabay.com/audio/2021/12/13/audio_b9c0dc9e48.mp3",
    "https://cdn.pixabay.com/audio/2021/12/07/audio_bfabd7c12a.mp3",
    "https://cdn.pixabay.com/audio/2021/12/01/audio_6d87e99a12.mp3",
    "https://cdn.pixabay.com/audio/2021/11/25/audio_91b32e02f9.mp3",
    "https://cdn.pixabay.com/audio/2021/11/24/audio_82498b22da.mp3",
    "https://cdn.pixabay.com/audio/2021/11/24/audio_c3dfe250e3.mp3",
    "https://cdn.pixabay.com/audio/2021/11/23/audio_64b2dd1bce.mp3",
    "https://cdn.pixabay.com/audio/2021/11/23/audio_035a943c87.mp3",
    "https://cdn.pixabay.com/audio/2021/11/20/audio_447ff1bec8.mp3",
    "https://cdn.pixabay.com/audio/2021/11/13/audio_cb4f1212a9.mp3",
    "https://cdn.pixabay.com/audio/2021/11/07/audio_35719208a2.mp3",
    "https://cdn.pixabay.com/audio/2021/11/05/audio_b66e48cda5.mp3",
    "https://cdn.pixabay.com/audio/2021/11/01/audio_00fa5593f3.mp3",
    "https://cdn.pixabay.com/audio/2021/11/01/audio_67c5757bac.mp3",
    "https://cdn.pixabay.com/audio/2021/10/25/audio_b3ada93101.mp3",
    "https://cdn.pixabay.com/audio/2021/10/25/audio_05570f2464.mp3",
    "https://cdn.pixabay.com/audio/2021/10/25/audio_47edc456e3.mp3",
    "https://cdn.pixabay.com/audio/2021/10/15/audio_2320f2b0bc.mp3",
    "https://cdn.pixabay.com/audio/2021/09/25/audio_153f263349.mp3",
    "https://cdn.pixabay.com/audio/2021/09/06/audio_14fb3b6893.mp3",
    "https://cdn.pixabay.com/audio/2021/08/08/audio_dc39bde808.mp3",
    "https://cdn.pixabay.com/audio/2021/08/08/audio_c9a4a1d834.mp3",
    "https://cdn.pixabay.com/audio/2021/08/08/audio_6e054b59f6.mp3",
    "https://cdn.pixabay.com/audio/2021/08/08/audio_88447e769f.mp3",
    "https://cdn.pixabay.com/audio/2021/08/08/audio_6eb9c39740.mp3",
    "https://cdn.pixabay.com/audio/2021/07/27/audio_6623aaf984.mp3",
    "https://cdn.pixabay.com/audio/2021/07/27/audio_202082aa0b.mp3",
    "https://cdn.pixabay.com/audio/2021/07/27/audio_6d7cd70222.mp3",
    "https://cdn.pixabay.com/audio/2021/07/26/audio_c8102c4eae.mp3",
    "https://cdn.pixabay.com/audio/2021/07/24/audio_c2bf654098.mp3",
    "https://cdn.pixabay.com/audio/2021/07/22/audio_9584aae297.mp3",
    "https://cdn.pixabay.com/audio/2021/05/20/audio_cb31fe8a54.mp3",
    "https://cdn.pixabay.com/audio/2020/10/11/audio_746c5a0fb3.mp3",
    "https://cdn.pixabay.com/audio/2020/11/10/audio_547ebbf828.mp3",
    "https://cdn.pixabay.com/audio/2021/04/07/audio_d5755615b6.mp3",
    "https://cdn.pixabay.com/audio/2021/04/07/audio_8ed06844ef.mp3",
];

async function main() {
    let url: string;
    for (let id = 0; id < URLS.length; id++) {
        url = URLS[id];

        const response = await axios.get(url, { responseType: "stream" });
        const writeStream = fs.createWriteStream(
            path.join(OUT_DIR, id++ + ".mp3")
        );

        response.data.pipe(writeStream);
    }
}

main();
