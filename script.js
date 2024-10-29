const memoryBlocks = [
    { size: 20, allocated: false, processSize: null, fitStrategy: null },
    { size: 14, allocated: false, processSize: null, fitStrategy: null },
    { size: 18, allocated: false, processSize: null, fitStrategy: null },
    { size: 8, allocated: false, processSize: null, fitStrategy: null },
    { size: 10, allocated: false, processSize: null, fitStrategy: null }
];

const memoryDisplay = document.getElementById('memoryDisplay');
const messageDisplay = document.getElementById('message');

function renderMemory() {
    memoryDisplay.innerHTML = ''; 
    memoryBlocks.forEach((block, index) => {
        const div = document.createElement('div');
        div.classList.add('block', block.allocated ? 'allocated' : 'free');

        // Apply different colors based on the allocation strategy
        if (block.allocated) {
            if (block.fitStrategy === 'best-fit') {
                div.classList.add('best-fit');
            } else if (block.fitStrategy === 'worst-fit') {
                div.classList.add('worst-fit');
            }
        }

        div.innerText = block.allocated 
            ? `Process: ${block.processSize}MB`
            : `Block ${index + 1}: ${block.size}MB`;

        if (block.allocated) {
            const strategySpan = document.createElement('span');
            strategySpan.classList.add('fit-strategy');
            strategySpan.innerText = `(${block.fitStrategy.replace('-', ' ')})`;
            div.appendChild(strategySpan);
        }

        memoryDisplay.appendChild(div);
    });
}

function allocateMemory(size, strategy) {
    let blockIndex = -1;

    if (strategy === 'first-fit') {
        blockIndex = memoryBlocks.findIndex(block => !block.allocated && block.size >= size);
    } else if (strategy === 'best-fit') {
        let bestFit = null;
        memoryBlocks.forEach((block, index) => {
            if (!block.allocated && block.size >= size) {
                if (bestFit === null || block.size < memoryBlocks[bestFit].size) {
                    bestFit = index;
                }
            }
        });
        blockIndex = bestFit;
    } else if (strategy === 'worst-fit') {
        let worstFit = null;
        memoryBlocks.forEach((block, index) => {
            if (!block.allocated && block.size >= size) {
                if (worstFit === null || block.size > memoryBlocks[worstFit].size) {
                    worstFit = index;
                }
            }
        });
        blockIndex = worstFit;
    }

    if (blockIndex !== -1) {
        memoryBlocks[blockIndex].allocated = true;
        memoryBlocks[blockIndex].processSize = size;
        memoryBlocks[blockIndex].fitStrategy = strategy;

        const blockDivs = memoryDisplay.children;
        blockDivs[blockIndex].classList.add('highlight');
        setTimeout(() => {
            blockDivs[blockIndex].classList.remove('highlight');
        }, 700); 

        renderMemory();
        messageDisplay.textContent = `Process of size ${size}MB allocated to Block ${blockIndex + 1} `;
        messageDisplay.style.color = 'green';
    } else {
        messageDisplay.textContent = `No available block can accommodate the process of size ${size}MB.`;
        messageDisplay.style.color = 'red';
    }
}

document.getElementById('allocationForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const size = parseInt(document.getElementById('processSize').value);
    const strategy = document.getElementById('strategy').value;
    allocateMemory(size, strategy);
});

document.getElementById('resetButton').addEventListener('click', () => {
    memoryBlocks.forEach(block => {
        block.allocated = false;
        block.processSize = null;
        block.fitStrategy = null;
    });
    renderMemory();
    messageDisplay.textContent = '';
});

renderMemory();
