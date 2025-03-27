# Happy Rollup Deployment Guide  

This guide provides instructions to deploy and run **Happy Rollup** locally and on AWS, using Docker Compose. Happy Rollup is configured to operate on chain ID **78149** and the node RPC endpoint is: **http://65.0.119.186:8547**.

---

## Table of Contents  
1. [Local Development](#local-development)  
   - [1.1 Configuring and Running the Chain Locally](#11-configuring-and-running-the-chain-locally)  
   - [1.2 Updating Configuration Files](#12-updating-configuration-files)  
   - [1.3 Running the Chain Locally](#13-running-the-chain-locally)  
2. [Deploying Happy Rollup on AWS](#deploying-happy-rollup-on-aws)  
   - [2.1 Connecting to AWS EC2 Instance](#21-connecting-to-aws-ec2-instance)  
   - [2.2 Transferring Configuration Files to AWS](#22-transferring-configuration-files-to-aws)  
   - [2.3 Running the Rollup on AWS](#23-running-the-rollup-on-aws)  
3. [RPC Endpoint & Chain Details](#rpc-endpoint--chain-details)  
4. [Troubleshooting](#troubleshooting)  

---

## Local Development  

### 1.1 Configuring and Running the Chain Locally  

The Docker configuration can be found in the `espresso-build-something-real` repository. To run Happy Rollup locally, follow the steps below:  

1. Clone the repository:  
   ```bash  
   git clone https://github.com/EspressoSystems/espresso-build-something-real  
   cd espresso-build-something-real  
   ```  

2. Update configuration files as explained in the next section.  

---

### 1.2 Updating Configuration Files  

You'll need to modify the following configuration files with deployment addresses, keys, IDs, and RPC URLs:  

- **`config/full_node.json`**  
- **`config/l2_chain_info.json`**  

#### Required Updates  

- **In `config/l2_chain_info.json`:**  
  - Set `chainId` under `chain-config` to **78149** (the chain ID for Happy Rollup).  
  - Set `InitialChainOwner` to the address of the rollup owner.  
  - Update the rollup smart contract addresses based on the deployment details.  
  - Update `deployed-at` to the block number where the rollup proxy was created.  

- **In `config/full_node.json`:**  
  - Add the RPC provider's Arbitrum URL (e.g., Infura or Alchemy) to the `url` field.  
  - Set `id` under `chain` to **78149**.  
  - Update `private-key` fields for both the staker (validator) and batch poster addresses.  

**Note:**  
Ensure that your private keys are secure. Avoid pushing them to public repositories. Use environment variables if necessary.  

---

### 1.3 Running the Chain Locally  

For local development, use the Docker Compose configuration provided in the repository. This configuration will run Happy Rollup locally.  

**Docker Compose Configuration:**  
```yaml  
version: '2.2'  
services:  
  nitro:  
    image: ghcr.io/espressosystems/nitro-espresso-integration/nitro-node:integration  
    container_name: nitro-node  
    ports:  
      - "8547:8547"  
      - "8548:8548"  
      - "8549:8549"  
    command: --conf.file /config/full_node.json  
    volumes:  
      - ./config:/config  
      - ./wasm:/home/user/wasm/  
      - ./database:/home/user/.arbitrum  
    depends_on:  
      - validation_node  

  validation_node:  
    image: ghcr.io/espressosystems/nitro-espresso-integration/nitro-node:integration  
    container_name: validation_node  
    ports:  
      - "8949:8549"  
    volumes:  
      - ./config:/config  
    entrypoint: /usr/local/bin/nitro-val  
    command: --conf.file /config/validation_node_config.json  
```  

Start the chain using Docker Compose:  
```bash  
docker compose up -d  
```  

---

## Deploying Happy Rollup on AWS  

To deploy Happy Rollup on AWS EC2, follow the steps below.  

### 2.1 Connecting to AWS EC2 Instance  

1. **Set up the AWS Key:**  
   Move the downloaded key file and set appropriate permissions:  
   ```bash  
   mv ~/Downloads/Espresso.pem ~/.ssh/  
   chmod 400 ~/.ssh/Espresso.pem  
   ```  

2. **Connect to the EC2 instance:**  
   ```bash  
   ssh -i ~/.ssh/Espresso.pem ec2-user@65.0.119.186  
   ```  

---

### 2.2 Transferring Configuration Files to AWS  

1. Transfer configuration files to the EC2 instance:  
   ```bash  
   scp -i ~/.ssh/Espresso.pem /Users/happy/Developer/teackstack/espresso-build-something-real/config/* ec2-user@65.0.119.186:~/rollup/config/  
   ```  

2. Transfer the `docker-compose.yml` file to the EC2 instance:  
   ```bash  
   scp -i ~/.ssh/Espresso.pem /Users/happy/Developer/teackstack/espresso-build-something-real/docker-compose.yml ec2-user@65.0.119.186:~/rollup/  
   ```  

---

### 2.3 Running the Rollup on AWS  

Start the rollup on AWS using the following command:  
```bash  
docker compose up -d  
```  

---

## RPC Endpoint & Chain Details  

- **Rollup Name:** Happy Rollup  
- **Chain ID:** 78149  
- **RPC Endpoint:** [http://65.0.119.186:8547](http://65.0.119.186:8547)  

To check the balance of any address, use the following command (replace the address accordingly):  
```bash  
cast balance 0x78c36eD4B3cB79Cb78b187fDAF178DF0C36e5016 --rpc-url http://65.0.119.186:8547  
```  

---

## Troubleshooting  

### Common Error:  

```bash  
error acting as staker  
err="error advancing stake from node 2 (hash 0xee288c5dcc61206e6868fa7a01da6abaabe22d6c849718a47eb361857b7e8dd8): error generating node action: block validation is still pending"  
```  

**Cause:**  
This error is expected when running a newly deployed rollup with no recent activity. It occurs due to the absence of new nodes to stake on or new batches being posted.  

**Solution:**  
Allow the system to continue running. Once there is activity, the error should resolve automatically.  

---

Happy building and deploying with Happy Rollup! 🚀  
