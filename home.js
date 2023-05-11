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
    
    let auditRatio = totalUp / totalDown;

    const roundedNum = auditRatio.toFixed(1); // Rounded to 1 decimal place

    audit.innerHTML = `
     <div class="progress-bar">
    <div class="progress-bar__title">Received:</div>
    <div class="progress-bar__wrapper">
    <div class="progress-bar__bar" style="width: ${totalDown}%;"></div>
    <div class="progress-bar__value">{${totalDown}}%</div>
    </div>
  </div>
  <div class="progress-bar">
    <div class="progress-bar__title">Done:</div>
    <div class="progress-bar__wrapper">
    <div class="progress-bar__bar" style="width: ${totalUp}%;"></div>
    <div class="progress-bar__value">{${totalUp}}%</div>
    </div>
    <div class="progress-bar__title">Audit Ratio:</div>
        <div name="auditRatio">${roundedNum}</div>
  </div>`
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
            
            console.log(response);
            const id = response["data"]["data"]["user"][0]["id"];
            const login = response["data"]["data"]["user"][0]["login"];
            const totalDown = response["data"]["data"]["user"][0]["totalDown"];
            const totalUp = response["data"]["data"]["user"][0]["totalUp"];
            const auditRatio = response["data"]["data"]["user"][0]["auditRatio"];
            const roundedAudit = auditRatio.toFixed(1); // Rounded to 1 decimal place
            
            renderStatus(id, login, totalDown, totalUp, roundedAudit);
            progess(totalDown, totalUp);
            console.log('Response:', id,totalDown, totalUp, roundedAudit);
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
            console.log('Response:', response.data.data.transaction);
            callback(response.data.data.transaction);
        })
        .catch(error => {
            // Handle the error
            console.error(error);
        });
}

function homePage(eventId = 20) {
    console.log("eventId",eventId)
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
    let query2;
 
    getUserId(query, token, id => {
        if (eventId === 20||eventId === 37)  {
            console.log("id in here",id, eventId)
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
                   console.log("id",id, eventId)
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

function renderStatus(id, login, totalDown, totalUp, auditRatio,totalXP) {
    // show user status on the page  create element
    const status = document.getElementById('status');
    status.innerHTML = `
    <div class="card">
    <div class="card-body">
        <h5 class="card-title">${login}! See Your Awesome Status</h5>
        <p class="card-text">Received: ${totalDown}</p>
        <p class="card-text">Done: ${totalUp}</p>
        <p class="card-text">Audit Ratio: ${auditRatio}</p>
        <p class="card-text" id="totalXP" >Total XP: ${totalXP}</p>
    </div>
    </div>
    `;


}

function renderChart(response) {
    console.log(response);
    let allData = response.data.data.transaction.reverse();
    const chart = new frappe.Chart("#chart", {
        title: "Line and Bar Chart",
        data: {
            labels: allData.map((t) => t.createdAt),
            datasets: [{
                    name: "Cumulative Amount",
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
            },
            y: {
                label: " Amount",
            },
        },
    });
    if (document.getElementsByClassName("legend-dataset-text")){
        document.getElementsByClassName("legend-dataset-text")[0].x.baseVal[0].value = -10;   
        document.getElementsByClassName("legend-dataset-text")[1].x.baseVal[0].value = 20;   
    }
       


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
        console.log('piscine-js');
        eventId = 37;

    } else if (chartName === 'piscine-go') {
        console.log('piscine-go');
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
