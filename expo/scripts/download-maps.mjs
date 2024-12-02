import puppeteer from "puppeteer";
import fs from "fs";
import https from "https";

const imageLinks = [
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BD34_GeoTifv1-05.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BE45_GeoTifv1-03.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BD45_GeoTifv1-03.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BD33_GeoTifv1-07.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BC37_GeoTifv2-01.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BD43_GeoTifv1-03.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BK31_GeoTifv2-02.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BG34_GeoTifv1-03.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BJ28_GeoTifv2-03.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BG36_GeoTifv2-03.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BH37_GeoTifv1-05.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BJ30_GeoTifv1-03.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BK35_GeoTifv1-03.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BK34_GeoTifv1-02.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BJ29_GeoTifv2-04.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BJ33_GeoTifv1-02.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BH36_GeoTifv1-03.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BJ36_GeoTifv1-04.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BJ35_GeoTifv1-05.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BH33_GeoTifv1-03.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BH39_GeoTifv1-04.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BF33_GeoTifv1-04.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BF32_GeoTifv1-02.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BJ32_GeoTifv1-03.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BF35_GeoTifv1-03.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BF34_GeoTifv1-03.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BG33_GeoTifv1-02.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BG35_GeoTifv1-04.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BK32_GeoTifv1-02.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BH35_GeoTifv1-04.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BH40_GeoTifv1-03.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BG39_GeoTifv1-04.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BH38_GeoTifv1-07.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BF40_GeoTifv1-05.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BK28ptBJ28_GeoTifv1-02.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BH34_GeoTifv1-05.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BH32_GeoTifv1-03.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BJ34_GeoTifv1-06.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BH31_GeoTifv1-04.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BG40_GeoTifv1-04.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BK30_GeoTifv2-03.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BK29_GeoTifv2-02.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BG32_GeoTifv1-02.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BG38_GeoTifv1-06.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BH30_GeoTifv1-02.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BJ31_GeoTifv1-03.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BF37_GeoTifv1-03.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BF38_GeoTifv1-04.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BK33_GeoTifv1-03.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BF39_GeoTifv1-07.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BF31_GeoTifv1-03.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BG31_GeoTifv1-02.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BG37_GeoTifv1-02.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BF36_GeoTifv1-02.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BP24_GeoTifv1-07.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BP28_GeoTifv1-07.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BQ24_GeoTifv1-08.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BK39_GeoTifv2-03.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BM25ptBN25_GeoTifv1-03.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BQ21ptBQ22_GeoTifv1-03.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BH42_GeoTifv2-03.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BJ38_GeoTifv1-06.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BF41_GeoTifv1-02.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BJ43ptsBJ42BH42BH43_GeoTifv2-03.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BP25_GeoTifv1-05.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BQ26_GeoTifv1-05.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BG41_GeoTifv1-04.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BQ28_GeoTifv1-05.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BK40ptBK39_GeoTifv2-03.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BQ23_GeoTifv1-06.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BP27_GeoTifv1-04.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BN23_GeoTifv1-04.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BN22_GeoTifv1-03.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BF44_GeoTifv1-02.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BP30ptBQ30_GeoTifv1-02.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BQ25_GeoTifv2-03.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BG42_GeoTifv2-02.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BJ40ptBJ39_GeoTifv1-04.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BP22_GeoTifv1-03.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BF42_GeoTifv1-02.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BP29_GeoTifv1-04.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BN25_GeoTifv1-03.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BQ22_GeoTifv1-06.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BJ37_GeoTifv1-06.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BF45ptBF44_GeoTifv1-02.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BP23_GeoTifv1-05.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BG43_GeoTifv2-03.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BM24ptBN24_GeoTifv1-04.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BK36_GeoTifv1-06.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BK37_GeoTifv1-05.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BG44_GeoTifv2-02.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BF43_GeoTifv1-03.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BH43_GeoTifv2-02.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BJ39_GeoTifv1-05.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BP26ptBP27_GeoTifv1-03.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BN29ptBN28_GeoTifv1-03.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BN28_GeoTifv1-03.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BK38_GeoTifv1-04.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BN24_GeoTifv1-06.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BQ27_GeoTifv1-04.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BH41_GeoTifv1-03.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BN36_GeoTifv1-02.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BR25_GeoTifv1-05.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BV18_GeoTifv1-05.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BM33_GeoTifv1-03.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BS19_GeoTifv1-03.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BN38ptBN37_GeoTifv1-02.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BM35_GeoTifv1-04.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BN37_GeoTifv1-02.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BU19_GeoTifv1-04.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BQ29_GeoTifv1-04.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BN33_GeoTifv1-05.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BV16_GeoTifv1-03.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BP36_GeoTifv2-02.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BU18_GeoTifv1-03.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BR21_GeoTifv1-05.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BR23_GeoTifv1-06.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BS20_GeoTifv1-04.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BM37_GeoTifv1-03.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BL34_GeoTifv1-03.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BL33_GeoTifv1-02.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BL36_GeoTifv1-05.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BS21_GeoTifv1-04.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BL35_GeoTifv1-03.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BT19_GeoTifv1-05.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BR20_GeoTifv1-03.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BM36_GeoTifv1-03.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BR24_GeoTifv1-05.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BM39ptBM38_GeoTifv1-03.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BU20_GeoTifv1-05.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BL39_GeoTifv1-03.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BV19_GeoTifv1-06.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BN35_GeoTifv1-02.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BR22_GeoTifv1-04.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BT20_GeoTifv1-03.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BS23_GeoTifv1-02.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BM38_GeoTifv1-03.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BL37_GeoTifv1-03.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BL31ptBK31_GeoTifv2-02.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BL32_GeoTifv1-03.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BS22_GeoTifv1-03.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BL38_GeoTifv1-03.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BN32ptBP32_GeoTifv1-08.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BV20_GeoTifv1-05.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BN34_GeoTifv1-07.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BV17_GeoTifv1-03.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BM34_GeoTifv1-04.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BS25_GeoTifv1-03.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BP35_GeoTifv1-03.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BU27_GeoTifv1-02.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BS24_GeoTifv1-07.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BT28_GeoTifv1-05.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BS26_GeoTifv1-04.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BP33_GeoTifv1-10.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BS29_GeoTifv1-03.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BT22_GeoTifv1-05.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BT27_GeoTifv1-05.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BR29_GeoTifv1-04.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BU22_GeoTifv1-05.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BS28_GeoTifv1-03.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BV26_GeoTifv1-03.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BR27_GeoTifv1-05.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BR26_GeoTifv1-04.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BT26_GeoTifv2-02.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BQ36ptBQ35_GeoTifv2-02.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BP32_GeoTifv1-11.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BV25_GeoTifv1-02.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BP34_GeoTifv1-07.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BV24_GeoTifv1-02.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BU26_GeoTifv2-02.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BU25_GeoTifv1-03.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BQ32_GeoTifv1-08.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BP31_GeoTifv1-06.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BU24_GeoTifv1-03.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BV23_GeoTifv1-02.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BQ31_GeoTifv2-04.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BR34_GeoTifv2-01.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BT23_GeoTifv1-07.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BQ34_GeoTifv1-03.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BT21_GeoTifv1-05.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BR28_GeoTifv1-06.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BT25_GeoTifv2-03.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BV21_GeoTifv1-08.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BR33_GeoTifv2-04.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BV22_GeoTifv1-04.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BS27_GeoTifv1-03.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BQ33_GeoTifv1-06.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BT24_GeoTifv2-07.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BU21_GeoTifv1-03.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BU23_GeoTifv1-06.tif",
  "https://static.topo.linz.govt.nz/maps/topo50/geotiff/BQ35_GeoTifv2-02.tif",
];

const download = (url, destination) =>
  new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destination);

    https
      .get(url, (response) => {
        response.pipe(file);

        file.on("finish", () => {
          file.close(resolve(true));
        });
      })
      .on("error", (error) => {
        fs.unlink(destination);

        reject(error.message);
      });
  });

(async () => {
  // Launch the browser and open a new blank page
  // const browser = await puppeteer.launch();
  // const page = await browser.newPage();

  // // Navigate the page to a URL.
  // await page.goto(
  //   "https://www.linz.govt.nz/products-services/maps/new-zealand-topographic-maps/topo50-map-chooser"
  // );

  // await page.setViewport({ width: 1920, height: 1080 });
  // page.setDefaultNavigationTimeout(5000);
  // page.setDefaultTimeout(5000);
  // // const links = await page.$$("h4 > a");
  // const links = await page.evaluate(() => {
  //   const links = [];
  //   const elements = document.querySelectorAll("h4 > a");
  //   for (let element of elements) links.push(element.href);
  //   return links;
  // });

  // for (let i = 0; i < links.length; i++) {
  //   const page = await browser.newPage();
  //   console.log(`Navigating to ${i} ${links[i]}\n`);
  //   await page.goto(links[i]);
  //   const imageLink = await page.evaluate(() => {
  //     const links = [];
  //     const elements = document.querySelectorAll(".map__thumbnails-thumbnail");
  //     for (let element of elements) links.push(element.href);
  //     return links[1];
  //   });

  //   imageLinks.push(imageLink);
  // }

  // console.log(imageLinks, imageLinks.length);

  // await browser.close();

  // console.log(`Links completed with ${imageLinks.length} links\n\n`);

  // const saveLinksFile = imageLinks.join("\n");
  // fs.writeFile("imageLinks.txt", saveLinksFile, (err) => {
  //   if (err) {
  //     console.error("Error appending to file:", err);
  //   } else {
  //     console.log("Data has been appended successfully.");
  //   }
  // });

  for (let i = 0; i < imageLinks.length; i++) {
    const image = imageLinks[i];
    console.log(`Downloading ${image}`);
    await download(image, `./assets/images/topo50/${image.split("/").pop()}`);
  }

  // await Promise.all(
  //   imageLinks.map(async (image) => {
  //     console.log(`Downloading ${image}`);
  //     await download(image, `./assets/images/topo50/${image.split("/").pop()}`);
  //   })
  // );
})();

console.log("Done");
