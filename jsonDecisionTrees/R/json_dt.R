json_dt<-function(model,data){
  library(grid)
  library(partykit)
  fit<-ctree(model,data)
  return (partykit:::.list.rules.party(fit))
}
