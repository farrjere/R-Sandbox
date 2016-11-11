json_dt<-function(data,model){
  library(partykit)
  fit<-rpart(model,data)
  return (json_prsr(fit))
}
