json_dt<-function(data,model){
  library(partykit)
  fit<-ctree(model,data)
  return (partykit:::.list.rules.party(fit))
}
