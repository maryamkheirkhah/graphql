/* function formatBytes(bytes, decimals = 1) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    let size = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));
    if (size < 1) {
      size = 1;
    }
    if (size * Math.pow(k, i) < bytes) {
      size = size + 1;
    }
    return size + ' ' + sizes[i];
  }
   */
  
  
function progess(totalDown, totalUp) {
    const audit = document.getElementById('audit');
    // calcute the audit ratio = totatUp/totalDown
    auditRatioRender(totalDown, totalUp);
}
function updateTotalXP(totalXP) {
    const totalXPDiv = document.getElementById('totalXP');
    totalXPDiv.innerHTML = `<p class="card-text">Total XP: ${totalXP}</p>`;
}

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
            
            let infoData = response["data"]["data"]["user"][0];
            const id = infoData["id"];
            const login = infoData["login"];
            const totalDown = infoData["totalDown"];
            const totalUp = infoData["totalUp"];
            const auditRatio = infoData["auditRatio"];
            
            const roundedAudit = auditRatio.toFixed(1); // Rounded to 1 decimal place
            
            renderStatus(id, infoData["firstName"],infoData["lastName"], totalDown, totalUp, roundedAudit);
            progess(totalDown, totalUp);
            callback(id);
        })
        .catch(error => {
            // Handle the error
            console.error(error);
        });
}


function sendRequest(query, token,callback) {
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
            callback(response.data.data.transaction);
        })
        .catch(error => {
            // Handle the error
            console.error(error);
        });
}

function homePage(eventId = 20) {
    const token = localStorage.getItem('jwt');
    // Construct the GraphQL query
    const query = `{
        user{
            id
            login
            totalUp
            totalDown
            auditRatio
            email
            firstName
            lastName
        }
    }
    `;
    let query2;
 
    getUserId(query, token, id => {
        if (eventId === 20||eventId === 37)  {
            query2 = `
                 query {
                   transaction(where: { userId: { _eq: ${id} },type: { _eq:xp }, eventId: { _eq:${eventId}} }) {
                     amount
                     path
                     createdAt
                   }
                 }
               `;
               }else{
               query2 =`
               query {
                 transaction(where: { userId: { _eq: ${id} },type: { _eq:xp }, eventId: { _in:[10,2] } }) {
                   amount
                   path
                   createdAt
                 }
               }
             `;
               }
        const callbackTotal = (data) => {
            // calculate total XP from data
            let totalXP = 0;
            data.forEach((t) => {
                totalXP += t.amount;
            });
            updateTotalXP(totalXP);    
        }
        let data = sendRequest(query2, token, callbackTotal);
    });

}

function renderStatus(id, firstName,lastName, totalDown, totalUp, auditRatio,totalXP) {
    // show user status on the page  create element
    const status = document.getElementById('status');
    status.innerHTML = `
    <div class="card">
    <div class="card-body">
        <h5 class="card-title">Welcome ${firstName} ${lastName}!</h5>
        <p class="card-text">Received: ${totalDown}</p>
        <p class="card-text">Done: ${totalUp}</p>
        <p class="card-text">Audit Ratio: ${auditRatio}</p>
        <p class="card-text" id="totalXP" >Total XP: ${totalXP}</p>
    </div>
    </div>
    `;


}

function renderChart(response) {
    let allData = response.data.data.transaction.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    const chart = new frappe.Chart("#chart", {
        title: "Line and Bar Chart",
        data: {
            labels: allData.map((t) => {
                const date = new Date(t.createdAt);
                const year = date.getFullYear();
                const month = ("0" + (date.getMonth() + 1)).slice(-2);
                const day = ("0" + date.getDate()).slice(-2);
                const project = t.path.split("/")[3];
                return `${year}-${month}-${day} (${project})`;
            }),
            datasets: [{
                    name: "Cumulative",
                    values: allData.map((t, i, a) => {
                        const cumulativeAmount = a
                            .slice(0, i + 1)
                            .reduce((sum, t) => sum + t.amount, 0);
                        return cumulativeAmount;
                    }),
                    chartType: "line",
                },
                {
                    name: "Amount",
                    values: allData.map((t) => t.amount),
                    chartType: "bar",
                    
                },
            ],
        },
        type: "axis-mixed",
        height: 300,
        colors: ["#1e90ff", "#ff6384"],
        axisOptions: {
            xIsSeries: true,
            x: {
                label: "Date",
                type: "timeseries",
                tickFormat: "%b %d, %Y",
                tickInterval: "day"
            },
            y: {
                label: " Amount",
            },
        },
    });
}
function auditRatioRender(totalDown, totalUp) {
    let audit = totalUp / totalDown;

    const barChart = new frappe.Chart('#barChart', {
        data: {
            labels: [`Audit Ratio: ${audit} `],
            datasets: [{name: 'Received', values: [totalDown]},{name: 'Done', values: [totalUp]}]
          },
          title: 'auditRatio',
          type: 'bar',
          colors: ['#ff6384', '#36a2eb'],
          height: 500,
          width : 500,
          
    });
}

const chartSelect = document.getElementById('chart-select');
//20 school curriculum
// 37 piscine js
// 10 piscine go
let eventId ;
chartSelect.addEventListener('change', (event) => {
    const chartName = event.target.value;
    if (chartName === 'school-curriculum') {
        eventId = 20;
    } else if (chartName === 'piscine-js') {
        eventId = 37;

    } else if (chartName === 'piscine-go') {
        eventId = 10;
    
    }
    homePage(eventId);

});
const logoutBtn = document.querySelector('#logout-btn');

logoutBtn.addEventListener('click', () => {
  // Perform logout action here
    localStorage.clear();
    window.location.href = 'index.html';
});
homePage(eventId);
