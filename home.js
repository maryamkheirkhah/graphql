function getUserId(query, token, callback) {
    // Send the GraphQL query to the endpoint
    axios.post('https://01.gritlab.ax/api/graphql-engine/v1/graphql', {
            query
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            // Handle the response
            console.log(response);
            const id = response["data"]["data"]["user"][0]["id"];
            const totalDown = response["data"]["data"]["user"][0]["totalDown"];
            const totalUp = response["data"]["data"]["user"][0]["totalUp"];
            const auditRatio = response["data"]["data"]["user"][0]["auditRatio"];
            console.log('Response:', id, totalDown, totalUp, auditRatio);
            callback(id);
        })
        .catch(error => {
            // Handle the error
            console.error(error);
        });
}


function sendRequest(query, token) {
    // Send the GraphQL query to the endpoint
    axios.post('https://01.gritlab.ax/api/graphql-engine/v1/graphql', {
            query
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            // Handle the response
            renderChart(response);

        })
        .catch(error => {
            // Handle the error
            console.error(error);
        });
}

function homePage() {
    const token = localStorage.getItem('jwt');
    // Construct the GraphQL query
    const query = `{
        user{
            id
            login
            totalUp
            totalDown
            auditRatio
        }
    }
    `;
    getUserId(query, token, id => {
        const query2 = `
          query {
            transaction(where: { userId: { _eq: ${id} },type: { _eq:xp }, eventId: { _eq: 20 } }) {
              amount
              path
              createdAt
            }
          }
        `;
        sendRequest(query2, token);
    });

}

function renderChart(response) {

    const chart = document.getElementById("chart");
    chart.setAttribute("width", "100%");
    chart.setAttribute("height", "100%");
    const currentDate = new Date();

    // Set the start date to 6 months ago
    const startDate = new Date();
    startDate.setMonth(currentDate.getMonth() - 6);
    // Set the min and max values of the x-axis scale
    const scaleX = {
        minValue: startDate,
        maxValue: currentDate,
        step: "month",
        transform: {
            type: "date",
            all: "%M %d"
        }
    }
    let dataArray = response.data.data.transaction;
    const data = {
        x: [],
        y: [],
        labels: []
    };
    for (let i = dataArray.length - 1; i >= 0; i--) {
        data.x.push(dataArray[i].createdAt);
        data.y.push(dataArray[i].amount);
        data.labels.push(dataArray[i].path.split('/').pop());
    }
    console.log('Data:', data);
    console.log('X:', data.x);
    console.log('Y:', data.y);
    console.log('Labels:', data.labels);
    // Create ZingChart

    const chartData = {
        type: 'chart',
        data: {
            type: 'line',
            series: [{
                values: data.labels,
                text: '%v',
                backgroundColor: '#1E90FF',
                marker: {
                    visible: true
                }
            }],
            scaleX: {
                labels: data.x
            },
            scaleY: {
                labels: data.y
            }
        },
        tooltip: {
            text: '%node-label',
            backgroundColor: '#1E90FF',
            borderColor: '#1E90FF',
            borderWidth: 2,
            borderRadius: 5,
            fontSize: 16,
            padding: 10
        },
        height: '100%',
        width: '100%'
    };
    console.log('Chart Data:', chartData);
    /*             zingchart.exec("chart", "render", {
        data: chartData
    }); */
    zingchart.render({
        id: 'chart',
        data: chartData,
        height: '100%',
        width: '100%',
        output: 'canvas'
    });

    const xpList = response.data.data.transaction.map(transaction => transaction.amount);
    console.log('XP List:', xpList);
    const totalXp = xpList.reduce((acc, curr) => acc + curr, 0);
    console.log('Total XP:', totalXp);

}
homePage();