# Required packages
sudo apt-get install -y \
    autoconf \
    automake \
    cmake \
    g++ \
    git \
    libssl-dev \
    libtool \
    make \
    pkg-config

# Boost packages (also required)
sudo apt-get install -y \
    libboost-chrono-dev \
    libboost-context-dev \
    libboost-coroutine-dev \
    libboost-date-time-dev \
    libboost-filesystem-dev \
    libboost-iostreams-dev \
    libboost-locale-dev \
    libboost-program-options-dev \
    libboost-serialization-dev \
    libboost-signals-dev \
    libboost-system-dev \
    libboost-test-dev \
    libboost-thread-dev

# Optional packages (not required, but will make a nicer experience)
sudo apt-get install -y \
    doxygen \
    libncurses5-dev \
    libreadline-dev \
    perl

# Build steemd
git clone https://github.com/steemit/steem
cd steem
git checkout v0.18.4
git submodule update --init --recursive
mkdir build
cd build
cmake -DCMAKE_BUILD_TYPE=Release ..
make -j$(nproc) steemd
cp programs/steemd/steemd /usr/local/steem

# Mount /dev/shm
mount -o remount,size=45G /dev/shm

# Create folder & inject config
mkdir /usr/local/steem
echo "rpc-endpoint = 127.0.0.1:8090

seed-node=52.38.66.234:2001
seed-node=52.37.169.52:2001
seed-node=52.26.78.244:2001
seed-node=192.99.4.226:2001
seed-node=46.252.27.1:1337
seed-node=81.89.101.133:2001
seed-node=52.4.250.181:39705
seed-node=85.214.65.220:2001
seed-node=104.199.157.70:2001
seed-node=104.236.82.250:2001
seed-node=104.168.154.160:40696
seed-node=162.213.199.171:34191
seed-node=seed.steemed.net:2001
seed-node=steem.clawmap.com:2001
seed-node=seed.steemwitness.com:2001
seed-node=steem-seed1.abit-more.com:2001


public-api = database_api login_api network_broadcast_api follow_api market_history_api raw_block_api block_info_api

enable-plugin = witness account_history tags follow market_history

shared-file-size = 40G
shared-file-dir = /dev/shm" >> /usr/local/steem/config.ini

# Create service
echo "[Unit]
Description=steemd
After=network.target

[Service]
User=root
WorkingDirectory=/usr/local/steem
ExecStart=/usr/local/steem/steemd --data-dir /usr/local/steem -s seed.riversteem.com:2001 -s steemwitness.matthewniemerg.com:2001 -s steemd.pharesim.me:2001 -s seed.jesta.us:2001 -s anyx.co:2001 -s gtg.steem.house:2001
Restart=always

[Install]
WantedBy=multi-user.target" >> /etc/systemd/system/steem.service
