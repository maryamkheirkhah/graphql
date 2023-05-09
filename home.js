

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
            const login = response["data"]["data"]["user"][0]["login"];
            const totalDown = response["data"]["data"]["user"][0]["totalDown"];
            const totalUp = response["data"]["data"]["user"][0]["totalUp"];
            const auditRatio = response["data"]["data"]["user"][0]["auditRatio"];
            renderStatus(id,login, totalDown, totalUp, auditRatio);
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
function renderStatus(id, login, totalDown, totalUp, auditRatio) {
    // show user status on the page  create element
    const status = document.createElement('div');
    status.innerHTML = `
    <div class="card">
        <div class="card-body">
            <h5 class="card-title">User Status</h5>
            <p class="card-text">User Login: ${login}</p>
            <p class="card-text">Total Down: ${totalDown}</p>
            <p class="card-text">Total Up: ${totalUp}</p>
            <p class="card-text">Audit Ratio: ${auditRatio}</p>
        </div>
    </div>
    `;
    document.getElementById('status').appendChild(status);
    
    
}

function renderChart(response) {
    let allData = response.data.data.transaction.reverse();
    const chart = new frappe.Chart("#chart", {
      title: "Cumulative Line Chart",
      data: {
        labels:allData.map((t) => t.createdAt),
        datasets: [
          {
            name: "Amount",
            values: allData
              .map((t, i, a) => {
                const cumulativeAmount = a
                  .slice(0, i + 1)
                  .reduce((sum, t) => sum + t.amount, 0);
                return cumulativeAmount;
              }),
            chartType: "line",
          },
        ],
      },
      type: "axis-mixed",
      height: 300,
      colors: ["#1e90ff"],
      axisOptions: {
        xIsSeries: true,
        x: {
          label: "Date",
          type: "timeseries",
          tickFormat: "%b %d, %Y",
        },
        y: {
          label: "Amount (cumulative)",
        },
      },
    });
  }
  
homePage();

/* 
function renderChart(response) {
    console.log('Response:', response.data.data.transaction);
    let allData = response.data.data.transaction;
    const endDate = new Date();

    // Set the start date to 6 months ago
    const startDate = new Date();
    startDate.setMonth(endDate.getMonth() - 6);
    const startMoment = moment(startDate);
    const endMoment = moment(endDate);
    const numDays = endMoment.diff(startMoment, "days") + 1;

    const scaleX = {
        minValue: startDate,
        maxValue: endDate,
        numTicks: numDays,
        step: "day",
        transform: {
            type: "date",
            all: "%M %d"
        },
        labels: []
    };

    for (let i = 0; i < numDays; i++) {
        scaleX.labels.push(moment(startDate).add(i, "days").toDate());
    }

    const data = {
        x: [],
        y: [],
        labels: []
    };

    let cumulativeAmount = 0;
    for (let i = 0; i < numDays; i++) {
        const date = moment(startDate).add(i, "days").toDate();
        let amount = 0;
        for (let j = 0; j < allData.length; j++) {
            const transaction = allData[j];
            const transactionDate = new Date(transaction.createdAt);
            if (moment(transactionDate).isSame(date, "day")) {
                amount += transaction.amount;
                data.labels.push(transaction.path);

            }
        }
        cumulativeAmount += amount;
        data.x.push(date);
        data.y.push(cumulativeAmount);
        //data.labels.push(moment(date).format("MMM DD"));
        
    }

    console.log('Data:', data);
    console.log('X:', data.x);
    console.log('Y:', data.y);
    console.log('Labels:', data.labels);

    const chart = new frappe.Chart("#chart", {
        title: "Cumulative Amount",
        data: {
            labels: data.labels,
            datasets: [
                {
                    name: "Amount",
                    values: data.y
                }
            ]
        },
        type: 'line',
        height: 250,
        colors: ["#1E90FF"],
        axisOptions: {
            xIsSeries: true,
            x: scaleX
                
        }

    });
}

homePage(); */
