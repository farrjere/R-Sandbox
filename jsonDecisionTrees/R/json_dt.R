json_dt<-function(data,model){
  library(rpart)
  library(rpart.utils)
  library(jsonlite)
  fit<-rpart(model,data)
  rules<-rpart.rules.table(fit)
  return (toJSON(rules))
}
