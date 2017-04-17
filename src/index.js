
(async function() {

    console.log(1);

    await new Promise((resolve) => setTimeout(resolve, 3000));

        console.log(2);

})();
