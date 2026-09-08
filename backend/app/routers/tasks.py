from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app import models, schemas, auth, database

router = APIRouter(prefix="/projects/{project_id}/tasks", tags=["tasks"])

def check_project_owner(db: Session, project_id: int, user_id: int):
    project = db.query(models.Project).filter(models.Project.id == project_id, models.Project.owner_id == user_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project

@router.get("/", response_model=List[schemas.TaskResponse])
def get_tasks(project_id: int, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    check_project_owner(db, project_id, current_user.id)
    tasks = db.query(models.Task).filter(models.Task.project_id == project_id).all()
    return tasks

@router.post("/", response_model=schemas.TaskResponse)
def create_task(project_id: int, task: schemas.TaskCreate, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    check_project_owner(db, project_id, current_user.id)
    new_task = models.Task(**task.model_dump(), project_id=project_id)
    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    return new_task

@router.put("/{task_id}", response_model=schemas.TaskResponse)
def update_task(project_id: int, task_id: int, task_update: schemas.TaskBase, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    check_project_owner(db, project_id, current_user.id)
    
    task = db.query(models.Task).filter(models.Task.id == task_id, models.Task.project_id == project_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
        
    for key, value in task_update.model_dump().items():
        setattr(task, key, value)
        
    db.commit()
    db.refresh(task)
    return task

@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(project_id: int, task_id: int, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    check_project_owner(db, project_id, current_user.id)
    
    task = db.query(models.Task).filter(models.Task.id == task_id, models.Task.project_id == project_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
        
    db.delete(task)
    db.commit()
    return
