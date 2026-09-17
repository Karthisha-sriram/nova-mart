*** Settings ***
Library    RequestsLibrary

*** Variables ***
${BASE_URL}    http://localhost:3000

*** Test Cases ***
NOVA MART Application Should Be Reachable
    Create Session    nova_mart    ${BASE_URL}
    ${response}=    GET On Session    nova_mart    /
    Should Be Equal As Integers    ${response.status_code}    200
