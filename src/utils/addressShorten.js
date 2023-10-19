// This will shorten an ethereum address to show the first and last 3 characters

function addressShorten(address){

    try {
        if (typeof address !== 'string' || address.length < 10) {
            throw new Error('Invalid Ethereum address.');
        }
        const firstFiveChars = address.slice(0, 5);
        const lastFourChars = address.slice(-4);

        return `${firstFiveChars}...${lastFourChars}`;
    }
    catch (e) {
        console.log('not a valid eth addr')
    }

}

module.exports = {
    addressShorten,
}