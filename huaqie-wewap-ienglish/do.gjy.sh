#!/bin/bash

rm -rf dist.tar.gz && git add . && git commit -am 'update fix' && git pull && git push && npm run build && tar zcvf dist.tar.gz dist && scp -P2233 dist.tar.gz gjy@g2.huaqie.com:/home/lifesurge/website/mobile/ienglish

#rm -rf dist.tar.gz && git pull && git push && npm run build && tar zcvf dist.tar.gz dist && scp -P2233 dist.tar.gz gjy@g2.huaqie.com:/home/lifesurge/website/mobile/ienglish
