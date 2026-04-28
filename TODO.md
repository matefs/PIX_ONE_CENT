
Source: https://developers.woovi.com/api#tag/charge/GET/api/v1/charge

Artigo de resolução: 
https://woovi.com/articles/garantir-que-apenas-o-cliente-correto-pague-uma-cobranca-pix/

Validar se o payer que gerou o pix é o mesmo do pagante: 

Exatamente. Essa flag ensureSameTaxID: true é o "pulo do gato" para o seu simulador de validação de identidade.

Quando você ativa ela, a Woovi bloqueia o pagamento direto no checkout caso o CPF de quem está tentando pagar (dono da conta bancária) seja diferente do CPF que você enviou no objeto customer.taxID.

Por que usar no seu projeto de ECA:
Prevenção de Fraude: Impede que um menor de idade peça para um amigo ou parente pagar a validação por ele.

Compliance: Garante que o payer (quem pagou) é exatamente o customer (quem está se cadastrando).

Como fica o seu cURL atualizado:
Bash
curl --request POST \
  --url https://api.woovi-sandbox.com/api/v1/charge?return_existing=true \
  --header 'Authorization: Q2xpZW50X0lkXzA1ZTkwZWI0LTE3YWQtNGY1MC05NzljLTUxNzRlNDExNzMzNDpDbGllbnRfU2VjcmV0X2RBRkFkQXZieHBrc0tDbG1meDlHUjhyMXRtdmE4a2YyUzlITEMwbVRvN1E9' \
  --header 'Content-Type: application/json' \
  --data '{
	"correlationID": "age-check-unique-id",
	"value": 1,
	"type": "DYNAMIC",
	"comment": "Validação de identidade obrigatória",
	"ensureSameTaxID": true,
	"customer": {
		"name": "Nome do Usuário",
		"taxID": "12345678900",
		"email": "usuario@email.com"
	}
}'
O que acontece na prática:
Se o CPF bater: O pagamento é processado e o status muda para COMPLETED.

Se o CPF for diferente: O banco do pagador exibe uma mensagem de erro (geralmente "Pagamento não permitido para este destinatário") e a transação nem chega a ser concluída.

Isso mata a necessidade de você validar o payer manualmente no seu backend via código, pois a própria infra da Woovi já faz esse "gatekeeper" para você.



Fluxo: Pedir cpf/cnpj ->  criar uma charge na woovi -> gerar qrcode e apresentar na tela -> concluir pagamento ( pelo sandbox por enquanto ) -> verificar se o cpf/cnpj do pagante é o mesmo do customer (cliente que gerou o qrcode) -> consultar dados do pagante pelo bigboost  -> validar idade



# [ ] SDK 
```

Verifyage = onecent.setup(
chaves api woovi e bigboost
) 


Resposta = onecent.validate(
cpf/CNPJ 
) // create charge 


while(true) { 

resposta.status() // true or false  polling do client

} 





``` 
