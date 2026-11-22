---
title: Windowzão 
type: docs
---

### Passo a Passo para Criar uma VM Windows 10 no Proxmox

1. **Baixar a Imagem ISO do Windows 10**  
   - Defina a URL do ISO (neste exemplo, usamos a versão 19043.1165). Você precisa pegar essa URL nova sempre, visto que diretamente pelo site da microsoft, ela fica mudando.
   - Execute o comando para baixar a imagem para o diretório de templates:  
     ```bash
     wget -O /var/lib/vz/template/iso/Windows10.iso "https://software-download.microsoft.com/download/pr/19043.1165.210529-1541.co_release_CLIENT_CONSUMER_x64FRE_en-us.iso"
     ```

2. **Criar a Máquina Virtual (VM)**  
   - Crie uma nova VM com ID 9000, nome "Windows10", 4GB de memória e configuração de rede básica:  
     ```bash
     qm create 9000 --name Windows10 --memory 4096 --cpu host --net0 virtio,bridge=vmbr0
     ```

3. **Adicionar um Disco Virtual**  
   - Configure um disco virtual SATA (usando SCSI com o hardware virtio-scsi-pci) com 100GB de armazenamento:  
     ```bash
     qm set 9000 --scsihw virtio-scsi-pci --scsi0 /var/lib/vz/images/9000/vm-9000-disk-0.qcow2,ssd=1,size=100G
     ```

4. **Anexar a Imagem ISO ao Drive de CD/DVD**  
   - Associe a ISO baixada à unidade de CD/DVD da VM:  
     ```bash
     qm set 9000 --ide2 /var/lib/vz/template/iso/Windows10.iso,media=cdrom
     ```

5. **Configurar o Tipo de CPU**  
   - Altere o tipo de CPU para "kvm64" (recomendado para melhor desempenho):  
     ```bash
     qm set 9000 --cpu kvm64
     ```

6. **Habilitar o Driver de Vídeo QXL**  
   - Configure a VM para usar o driver QXL, que melhora a performance gráfica:  
     ```bash
     qm set 9000 --vga qxl
     ```

7. **Adicionar Consola Spice para Acesso Remoto**  
   - Ative a interface Spice, configure a placa de vídeo virtual e defina uma porta e senha (substitua `mypassword` por uma senha segura):  
     ```bash
     qm set 9000 --spicehw virtio-vga --spiceport 5900 --password mypassword
     ```

8. **Definir um UUID Único para a VM**  
   - Gere um UUID único para o SMBIOS, garantindo que a VM tenha uma identidade única:  
     ```bash
     qm set 9000 --smbios1 uuid=$(uuidgen)
     ```

9. **Iniciar a Máquina Virtual**  
   - Por fim, inicie a VM:  
     ```bash
     qm start 9000
     ```

---

**Observações Importantes:**

- **Senha:** Lembre-se de substituir `"mypassword"` por uma senha forte e segura.
- **Ajustes:** Você pode alterar os parâmetros de memória, CPU e armazenamento conforme as necessidades do seu ambiente.
- **Verificações:** Certifique-se de que o caminho para a ISO e para o disco virtual estejam corretos conforme a estrutura de diretórios do Proxmox.
