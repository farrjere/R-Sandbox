json_dt<-function(data,model){
  library(rpart)
  library(rpart.utils)
  fit<-rpart(model,data)
  rules<-rpart.rules.table(fit)
  return (rules)
}
