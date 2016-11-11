json_dt<-function(model,data){
  library(grid)
  library(partykit)
  fit<-ctree(formula = model,data=data)
  return (partykit:::.list.rules.party(fit))
}
